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

namespace QuizMaster.Application.Contestants
{
    public class List
    {
        public class Query : IRequest<List<Contestant>>
        {
            public Query(Guid quizId)
            {
                QuizId = quizId;
            }

            [Required]
            public Guid QuizId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Contestant>>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<Contestant>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await context.Contestants.Where(x => x.QuizId == request.QuizId).ToListAsync();
            }
        }
    }
}