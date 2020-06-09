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
            public string QuizCode { get; set; }
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
                var quiz = await context.Quiz.Include(x => x.QuizQuestions).SingleOrDefaultAsync(x => x.Code == request.QuizCode, cancellationToken);

                var questions = request.QuizItems.Select((x, i) => new QuizQuestion(x.Question, x.Answer, quiz.Id, i + 1));

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