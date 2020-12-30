using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace QuizMaster.Application.Quizzes
{
    public class Update
    {
        public class Command : IRequest<Quiz>
        {
            [Required]
            public string QuizCode { get; set; }

            [Required]
            public CommandBody CommandBody { get; set; }
        }


        public class CommandBody : IRequest<Quiz>
        {
            public QuizState? QuizState { get; set; }
            public int? QuestionNo { get; set; }
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
                var quiz = await context.Quiz.SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (request.CommandBody.QuestionNo.HasValue)
                {
                    quiz.QuestionNo = request.CommandBody.QuestionNo.Value;
                }
                if (request.CommandBody.QuizState.HasValue)
                {
                    quiz.State = request.CommandBody.QuizState.Value;
                }
                if (context.ChangeTracker.HasChanges())
                {
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return quiz;
                    }
                }
                else
                {
                    return quiz;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}