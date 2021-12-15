using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Admin
{
    public class QuizQuestions
    {
        public class Query : IRequest<List<QuizQuestion>>
        {
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
                var quizQuestions = await context.QuizQuestions.OrderBy(q=>q.QuizId).ToListAsync();
                return quizQuestions;
            }
        }
    }
}