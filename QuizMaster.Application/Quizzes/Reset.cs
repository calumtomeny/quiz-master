using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.Quizzes
{
    public class Reset
    {
        public class Command : IRequest<Quiz>
        {
            public Command(string quizCode)
            {
                QuizCode = quizCode;
            }

            public string QuizCode { get; private set; }

        }

        public class EmptyCommand : IRequest<Quiz>
        {

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
                var quiz = context.Quiz.SingleOrDefault(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }

                var quizContestants = context.Contestants.Where(x => x.QuizId == quiz.Id);
                if (quizContestants.Any())
                {
                    context.Contestants.RemoveRange(quizContestants);
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