using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Questions
{
    public class List
    {
        public class Query : IRequest<List<QuizQuestion>>
        {
            public Guid QuizId { get; set; }
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
                List<QuizQuestion> quizzes = null;

                quizzes = await context.QuizQuestions.Where(x => x.QuizId == request.QuizId).ToListAsync();

                return quizzes;
            }
        }
    }
}