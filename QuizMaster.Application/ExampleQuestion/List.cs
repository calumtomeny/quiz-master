using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.ExampleQuestions
{
    public class List
    {
        public class Query : IRequest<List<QuizQuestion>>
        {
            public string QuizCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<QuizQuestion>>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<QuizQuestion>> Handle(Query request, CancellationToken cancellationToken)
            {
                Random random = new Random();

                var exampleQuestion = context.ExampleQuestions.ToList();

                var randomQuestions = Enumerable.Range(1, 10)
                .Select(n => exampleQuestion[random.Next(0, exampleQuestion.Count())]).ToList();            

                var quiz = await context.Quiz.Include(x => x.QuizQuestions).SingleAsync(x => x.Code == request.QuizCode);

                quiz.QuizQuestions = randomQuestions
                .Select(x => new QuizQuestion(x.Question, x.Answer, quiz.Id, randomQuestions.IndexOf(x) + 1)).ToList();

                var success = await context.SaveChangesAsync() > 0;

                if (success)
                {
                    return quiz.QuizQuestions.ToList();
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}