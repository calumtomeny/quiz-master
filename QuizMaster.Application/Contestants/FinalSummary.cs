using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Contestants
{
    public class FinalSummary
    {
        public class Query : IRequest<List<QuestionSummary>>
        {
            public Query(Guid id)
            {
                Id = id;
            }

            public Guid Id { get; private set; }
        }

        public class QuestionSummary
        {
            public int Number { get; set; }
            public string Question { get; set; }
            public string CorrectAnswer { get; set; }
            public string ContestantAnswer { get; set; }
            public string FastestContestantName { get; set; }
            public bool ContestantIsFastest { get; set; }
            public int Score { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<QuestionSummary>>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<QuestionSummary>> Handle(Query request, CancellationToken cancellationToken)
            {
                var contestant = await context.Contestants.Include(x => x.ContestantAnswers).SingleOrDefaultAsync(x => x.Id == request.Id);
                if (contestant == null)
                {
                    return null;
                }

                var quiz = await context.Quiz.Include(x => x.QuizQuestions).ThenInclude(y => y.ContestantAnswers).SingleOrDefaultAsync(x => x.Id == contestant.QuizId);
                if (quiz == null)
                {
                    return null;
                }
                else if (quiz.State != QuizState.QuizEnded)
                {
                    return null;
                }

                var questionSummaries = new List<QuestionSummary>();

                foreach (QuizQuestion question in quiz.QuizQuestions)
                {
                    var contestantAnswerText = "";
                    var contestantIsFastest = false;
                    var score = 0;
                    var fastestContestantName = "";

                    var contestantAnswer = question.ContestantAnswers.Find(x => x.ContestantId == contestant.Id);
                    if (contestantAnswer != null)
                    {
                        contestantAnswerText = contestantAnswer.Answer;
                        contestantIsFastest = contestantAnswer.Fastest;
                        score = contestantAnswer.Score;
                    }
                    if (!contestantIsFastest)
                    {
                        var fastestContestantAnswer = question.ContestantAnswers.Find(x => x.Fastest == true);
                        if (fastestContestantAnswer != null)
                        {
                            var fastestContestant = await context.Contestants.SingleOrDefaultAsync(x => x.Id == fastestContestantAnswer.ContestantId);
                            fastestContestantName = fastestContestant.Name;
                        }
                    }
                    else
                    {
                        fastestContestantName = contestant.Name;
                    }

                    questionSummaries.Add(
                        new QuestionSummary
                        {
                            Number = question.Number,
                            Question = question.Question,
                            CorrectAnswer = question.Answer,
                            ContestantAnswer = contestantAnswerText,
                            FastestContestantName = fastestContestantName,
                            ContestantIsFastest = contestantIsFastest,
                            Score = score,
                        }
                    );
                }
                return questionSummaries;
            }
        }
    }
}
