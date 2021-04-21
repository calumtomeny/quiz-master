using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Quizzes
{
    public class FinalSummary
    {
        public class Query : IRequest<List<QuestionSummary>>
        {
            public Query(string quizCode)
            {
                QuizCode = quizCode;
            }

            [Required]
            public String QuizCode { get; set; }
        }
        public class ContestantResponse
        {
            public string Name { get; set; }
            public string Answer { get; set; }
            public bool AnsweredCorrectly { get; set; }
            public bool AnsweredCorrectlyFastest { get; set; }
        }
        public class QuestionSummary
        {
            public int Number { get; set; }
            public string Question { get; set; }
            public string Answer { get; set; }
            public List<ContestantResponse> Contestants { get; set; }
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
                Quiz quiz = await context.Quiz.Include(x => x.Contestants).Include(x => x.QuizQuestions).ThenInclude(x => x.ContestantAnswers).SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }
                var questionSummaries = new List<QuestionSummary>();
                foreach (QuizQuestion question in quiz.QuizQuestions)
                {
                    var answers = new List<ContestantResponse>();
                    foreach (var contestant in quiz.Contestants)
                    {
                        var contestantAnswer = question.ContestantAnswers.Single(x => x.ContestantId == contestant.Id);
                        answers.Add(
                            new ContestantResponse
                            {
                                Name = contestant.Name,
                                Answer = contestantAnswer.Answer,
                                AnsweredCorrectly = contestantAnswer.Correct,
                                AnsweredCorrectlyFastest = contestantAnswer.Fastest,
                            }
                        );
                    }
                    questionSummaries.Add(
                        new QuestionSummary
                        {
                            Number = question.Number,
                            Question = question.Question,
                            Answer = question.Answer,
                            Contestants = answers,
                        }
                    );

                }
                return questionSummaries;
            }
        }
    }
}
