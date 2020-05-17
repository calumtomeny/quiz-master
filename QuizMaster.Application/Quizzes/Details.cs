using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Quizzes
{
    public class Details
    {
        public class Query : IRequest<Quiz>
        {
            public Query(Guid id)
            {
                Id = id;
            }

            public Guid Id { get; private set; }
        }

        public class Handler : IRequestHandler<Query, Quiz>
        {
            private readonly QuizContext context;

            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<Quiz> Handle(Query request, CancellationToken cancellationToken)
            {
                var quiz = await context.Quiz.FindAsync(request.Id);

                return quiz;
            }
        }
    }
}