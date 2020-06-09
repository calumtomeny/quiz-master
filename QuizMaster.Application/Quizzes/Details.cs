using System;
using System.Collections.Generic;
using System.Linq;
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
            public Query(string quizCode)
            {
                QuizCode = quizCode;
            }

            public string QuizCode { get; private set; }
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
                var quiz = context.Quiz.SingleOrDefault(x => x.Code == request.QuizCode);

                return quiz;
            }
        }
    }
}