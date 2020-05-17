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
    public class List
    {
        public class Query : IRequest<List<Quiz>>
        {
            public string QuizCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Quiz>>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<Quiz>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Quiz> quizzes = null;

                if (string.IsNullOrWhiteSpace(request.ToString()))
                {
                    quizzes = await context.Quiz.ToListAsync();
                }
                else
                {
                    quizzes = await context.Quiz.Where(x => x.Code == request.QuizCode).ToListAsync();
                }

                return quizzes;
            }
        }
    }
}