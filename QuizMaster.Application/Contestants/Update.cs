using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Contestants
{
    public class Update
    {
        public class Command : IRequest<Contestant>
        {
            [Required]
            public Guid ContestantId { get; set; }

            [Required]
            public CommandBody Update { get; set; }
        }

        public class CommandList : IRequest<List<Contestant>>
        {
        [Required]
        public List<Command> Commands { get; set; }
        }        

        public class CommandBody : IRequest<Contestant>
        {
            public int? Score { get; set; }
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
                var contestant = context.Contestants.SingleOrDefault(x => x.Id == request.ContestantId);
                if (contestant == null)
                {
                    return null;
                }

                if (request.Update.Score.HasValue)
                {
                    contestant.Score = request.Update.Score.Value;
                }

                if (context.ChangeTracker.HasChanges())
                {
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return contestant;
                    }
                }
                else
                {
                    return contestant;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }

        public class ListHandler : IRequestHandler<CommandList, List<Contestant>>
        {
            private readonly QuizContext context;
            public ListHandler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<Contestant>> Handle(CommandList request, CancellationToken cancellationToken)
            {
                var contestants = new List<Contestant>();
                foreach (Command command in request.Commands)
                {
                    var contestant = context.Contestants.SingleOrDefault(x => x.Id == command.ContestantId);
                    if (contestant != null)
                    {
                        if (command.Update.Score.HasValue)
                        {
                            contestant.Score = command.Update.Score.Value;
                        }
                        contestants.Add(contestant);
                    }
                }
                if (context.ChangeTracker.HasChanges())
                {
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return contestants;
                    }
                }
                else
                {
                    return contestants;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}