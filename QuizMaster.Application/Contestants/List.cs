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
            public Query(string quizCode)
            {
                QuizCode = quizCode;
            }

            [Required]
            public String QuizCode { get; set; }
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
                Quiz quiz = context.Quiz.SingleOrDefault(x => x.Code == request.QuizCode);
                return await context.Contestants.Where(x => x.QuizId == quiz.Id).ToListAsync();
            }
        }
    }
}