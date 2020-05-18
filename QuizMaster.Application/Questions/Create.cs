using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace QuizMaster.Application.Questions
{
    public class Create
    {
        public class CommandItem
        {
            [Required]
            public String Question { get; set; }

            [Required]
            public String Answer { get; set; }

            [Required]
            public int Number { get; set; }
        }

        public class Command : IRequest<List<QuizQuestion>>
        {
            [Required]
            public List<CommandItem> QuizItems { get; set; }

            [Required]
            public Guid QuizId { get; set; }
        }

        public class Handler : IRequestHandler<Command, List<QuizQuestion>>
        {
            private readonly QuizContext context;
            public Handler(QuizContext context)
            {
                this.context = context;

            }

            public async Task<List<QuizQuestion>> Handle(Command request, CancellationToken cancellationToken)
            {
                var questions = request.QuizItems.Select(x => new QuizQuestion(x.Question, x.Answer, request.QuizId, x.Number));

                var quiz = await context.Quiz.Include(x => x.QuizQuestions).SingleOrDefaultAsync(x => x.Id == request.QuizId, cancellationToken);

                quiz.QuizQuestions = questions.ToList();

                var success = await context.SaveChangesAsync() > 0;

                if (success)
                {
                    return questions.ToList();
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}