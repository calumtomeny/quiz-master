using System;
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

        public class ParticipantQuizDetails
        {
            public string QuizName { get; set; }
            public QuizState? QuizState { get; set; }
            public int? QuestionNo { get; set; }
            public long? QuestionStartTime { get; set; }
            public string Question { get; set; }
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
                    var question = "";
                    if (quiz.State == QuizMaster.Domain.QuizState.QuestionInProgress)
                    {
                        question = quiz.QuizQuestions.Find(x => x.Number == quiz.QuestionNo).Question;
                    }
                    return new ParticipantQuizDetails()
                    {
                        QuizName = quiz.Name,
                        QuizState = quiz.State,
                        QuestionNo = quiz.QuestionNo,
                        QuestionStartTime = quiz.QuestionStartTime,
                        Question = question,
                    };
                }
            }
        }
    }
}