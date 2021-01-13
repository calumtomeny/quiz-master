using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace QuizMaster.Application.ContestantAnswers
{
    public class Create
    {
        public class Command : IRequest<ContestantAnswer>
        {
            [Required]
            public string QuizCode { get; set; }
            [Required]
            public int QuestionNumber { get; set; }
            [Required]
            public Guid ContestantId { get; set; }

            [Required]
            public string Answer { get; set; }
            [Required]
            public long TimeRemainingMs { get; set; }
            [Required]
            public float PercentageTimeRemaining { get; set; }

            public Command(string quizCode, int questionNumber, Guid contestantId, string answer, long timeRemainingMs, float percentageTimeRemaining)
            {
                this.QuizCode = quizCode;
                this.QuestionNumber = questionNumber;
                this.ContestantId = contestantId;
                this.Answer = answer;
                this.TimeRemainingMs = timeRemainingMs;
                this.PercentageTimeRemaining = percentageTimeRemaining;
            }
        }

        public class Handler : IRequestHandler<Command, ContestantAnswer>
        {
            private readonly QuizContext context;
            public Handler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<ContestantAnswer> Handle(Command request, CancellationToken cancellationToken)
            {
                var quiz = await context.Quiz.Include(x => x.Contestants).Include(x => x.QuizQuestions).SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }
                var contestant = quiz.Contestants.Find(x => x.Id == request.ContestantId);
                if (contestant == null)
                {
                    return null;
                }
                var question = quiz.QuizQuestions.Find(x => x.Number == quiz.QuestionNo);
                if (question == null)
                {
                    return null;
                }
                var contestantAnswer = new ContestantAnswer(question.Id, contestant.Id, request.Answer, request.TimeRemainingMs, request.PercentageTimeRemaining, false, false, 0, 0);
                context.ContestantAnswers.Add(contestantAnswer);

                var success = await context.SaveChangesAsync() > 0;

                if (success)
                {
                    return contestantAnswer;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}