using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Quizzes
{
    public class Details
    {
        public class Query : IRequest<Quiz>
        {
            public Query(string quizCode)
            {
                QuizCode = quizCode;
            }

            public string QuizCode { get; private set; }
        }

        public class ParticipantQuery : IRequest<ParticipantQuizDetails>
        {
            public ParticipantQuery(string quizCode, Guid participantId)
            {
                this.QuizCode = quizCode;
                this.ParticipantId = participantId;
            }

            public string QuizCode { get; private set; }
            public Guid ParticipantId { get; private set; }
        }

        public class QuizMasterQuery : IRequest<QuizMasterQuizDetails>
        {
            public QuizMasterQuery(string quizCode)
            {
                this.QuizCode = quizCode;
            }

            public string QuizCode { get; private set; }
        }

        public class ParticipantQuizDetails
        {
            public string QuizName { get; set; }
            public QuizState? QuizState { get; set; }
            public int? QuestionNo { get; set; }
            public long? QuestionStartTime { get; set; }
            public string Question { get; set; }
            public string Answer { get; set; }
            public long TimeRemainingMs { get; set; }
            public float TimeRemainingPerc { get; set; }
        }

        public class QuizMasterQuizDetails
        {
            public string QuizName { get; set; }
            public QuizState? QuizState { get; set; }
            public List<QuizQuestion> Questions { get; set; }
            public List<Contestant> Contestants { get; set; }
            public int? CurrentQuestionNo { get; set; }
            public long? CurrentQuestionStartTime { get; set; }
            public string CurrentQuestion { get; set; }
            public List<ContestantAnswer> CurrentContestantAnswers { get; set; }
        }

        public class QuizStateValues
        {
            public QuizState? QuizState { get; set; }
            public int? QuestionNo { get; set; }
            public long QuestionStartTime { get; set; }
        }

        public class Handler : IRequestHandler<Query, Quiz>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<Quiz> Handle(Query request, CancellationToken cancellationToken)
            {
                var quiz = await context.Quiz.SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                return quiz;
            }
        }

        public class ParticipantQueryHandler : IRequestHandler<ParticipantQuery, ParticipantQuizDetails>
        {
            private readonly QuizContext context;

            public ParticipantQueryHandler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<ParticipantQuizDetails> Handle(ParticipantQuery request, CancellationToken cancellationToken)
            {
                var quiz = await context.Quiz.Include(x => x.Contestants).Include(x => x.QuizQuestions).SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }
                if (quiz.Contestants.Find(x => x.Id == request.ParticipantId) == null)
                {
                    return null;
                }
                else
                {
                    var questionText = "";
                    var answerText = "";
                    long timeRemainingMs = 0;
                    float timeRemainingPerc = 0.0F;
                    if (quiz.State == QuizMaster.Domain.QuizState.QuestionInProgress)
                    {
                        var question = quiz.QuizQuestions.Find(x => x.Number == quiz.QuestionNo);
                        questionText = question.Question;

                        var contestantAnswer = await context.ContestantAnswers.SingleOrDefaultAsync(x => (x.QuizQuestionId == question.Id) && (x.ContestantId == request.ParticipantId));
                        if (contestantAnswer != null)
                        {
                            answerText = contestantAnswer.Answer;
                            timeRemainingMs = contestantAnswer.TimeRemainingMs;
                            timeRemainingPerc = contestantAnswer.PercentageTimeRemaining;
                        }
                    }
                    return new ParticipantQuizDetails()
                    {
                        QuizName = quiz.Name,
                        QuizState = quiz.State,
                        QuestionNo = quiz.QuestionNo,
                        QuestionStartTime = quiz.QuestionStartTime,
                        Question = questionText,
                        Answer = answerText,
                        TimeRemainingMs = timeRemainingMs,
                        TimeRemainingPerc = timeRemainingPerc,
                    };
                }
            }
        }

        public class QuizMasterQueryHandler : IRequestHandler<QuizMasterQuery, QuizMasterQuizDetails>
        {
            private readonly QuizContext context;

            public QuizMasterQueryHandler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<QuizMasterQuizDetails> Handle(QuizMasterQuery request, CancellationToken cancellationToken)
            {
                var quiz = await context.Quiz
                                            .Include(x => x.Contestants)
                                            .Include(x => x.QuizQuestions)
                                            .SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }
                else
                {
                    var questionText = "";
                    var contestantAnswers = new List<ContestantAnswer>();
                    if (quiz.QuestionNo > 0)
                    {
                        var question = quiz.QuizQuestions.Find(x => x.Number == quiz.QuestionNo);
                        questionText = question.Question;
                        contestantAnswers = await context.ContestantAnswers.Where(y => y.QuizQuestionId == question.Id).ToListAsync();
                    }
                    return new QuizMasterQuizDetails()
                    {
                        QuizName = quiz.Name,
                        QuizState = quiz.State,
                        Questions = quiz.QuizQuestions,
                        Contestants = quiz.Contestants,
                        CurrentQuestionNo = quiz.QuestionNo,
                        CurrentQuestionStartTime = quiz.QuestionStartTime,
                        CurrentQuestion = questionText,
                        CurrentContestantAnswers = contestantAnswers,
                    };
                }
            }
        }
    }
}