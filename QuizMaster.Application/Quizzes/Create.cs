using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace QuizMaster.Application.Quizzes
{
    public class Create
    {
        public class Command : IRequest<Quiz>
        {
            [Required]
            public String Name { get; set; }
        }

        public class Handler : IRequestHandler<Command, Quiz>
        {
            private readonly QuizContext context;
            public Handler(QuizContext context)
            {
                this.context = context;

            }

            public async Task<Quiz> Handle(Command request, CancellationToken cancellationToken)
            {
                var quiz = new Quiz(request.Name);
                context.Add(quiz);
                var success = await context.SaveChangesAsync() > 0;

                if (success)
                {
                    return quiz;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}