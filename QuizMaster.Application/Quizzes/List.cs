using System.Collections.Generic;
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
        public class Query : IRequest<List<Quiz>> { }

        public class Handler : IRequestHandler<Query, List<Quiz>>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<Quiz>> Handle(Query request, CancellationToken cancellationToken)
            {
                var quizzes = await context.Quiz.ToListAsync();

                return quizzes;
            }
        }
    }
}