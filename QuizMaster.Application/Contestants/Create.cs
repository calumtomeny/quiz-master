using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Contestants
{
    public class Create
    {
        public class Command : IRequest<Contestant>
        {
            [Required]
            public Guid QuizId { get; set; }

            [Required]
            public string ContestantName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Contestant>
        {
            private readonly QuizContext context;
            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<Contestant> Handle(Command request, CancellationToken cancellationToken)
            {
                var contestant = new Contestant(request.ContestantName, request.QuizId);

                context.Contestants.Add(contestant);

                var success = await context.SaveChangesAsync() > 0;

                if (success)
                {
                    return contestant;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}