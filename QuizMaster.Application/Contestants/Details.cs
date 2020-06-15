using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Contestants
{
    public class Details
    {
        public class Query : IRequest<Contestant>
        {
            public Query(Guid id)
            {
                Id = id;
            }

            public Guid Id { get; private set; }
        }

        public class Handler : IRequestHandler<Query, Contestant>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<Contestant> Handle(Query request, CancellationToken cancellationToken)
            {
                var quiz = await context.Contestants.SingleOrDefaultAsync(x => x.Id == request.Id);
                return quiz;
            }
        }
    }
}