using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuizMaster.Application.Contestants
{
    public class Create
    {
        public class Command : IRequest<Contestant>
        {
            [Required]
            public string QuizCode { get; set; }

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
                var quiz = context.Quiz.Include(x => x.Contestants).SingleOrDefault(x => x.Code == request.QuizCode);

                if (quiz == null)
                {
                    return null;
                }

                var contestantName = request.ContestantName.Trim();

                if (!quiz.Contestants.Any(x => x.Name == contestantName))
                {
                    var contestant = new Contestant(contestantName, quiz.Id);

                    context.Contestants.Add(contestant);

                    var success = await context.SaveChangesAsync() > 0;

                    if (success)
                    {
                        return contestant;
                    }

                    throw new Exception("There was a problem saving changes.");
                }
                else 
                {
                    return null;
                }
            }
        }
    }
}
