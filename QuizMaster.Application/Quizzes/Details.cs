using System;
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

        public class QuizStateValues
        {
            public QuizState? QuizState { get; set; }
            public int? QuestionNo { get; set;}
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
                var quiz = await context.Quiz.SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                return quiz;
            }
        }
    }
}