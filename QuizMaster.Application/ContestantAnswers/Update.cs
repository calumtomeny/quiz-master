using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using QuizMaster.Domain;
using QuizMaster.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuizMaster.Application.ContestantAnswers
{
    public class Update
    {
        public class Command : IRequest<List<ContestantAnswer>>
        {
            [Required]
            public string QuizCode { get; set; }
            [Required]
            public int QuestionNo { get; set; }

            [Required]
            public List<UpdateValues> AnswerUpdates { get; set; }
        }

        public class RequestBody
        {
            [Required]
            public int QuestionNo { get; set; }
            public List<UpdateValues> AnswerUpdates { get; set; }
        }

        public class UpdateValues
        {
            public Guid ContestantId { get; set; }
            public bool Correct { get; set; }
            public bool Fastest { get; set; }
            public int BonusPoints { get; set; }
            public int Score { get; set; }
        }

        public class ListHandler : IRequestHandler<Command, List<ContestantAnswer>>
        {
            private readonly QuizContext context;
            public ListHandler(QuizContext context)
            {
                this.context = context;
            }

            public async Task<List<ContestantAnswer>> Handle(Command request, CancellationToken cancellationToken)
            {

                var quiz = await context.Quiz.Include(x => x.QuizQuestions).SingleOrDefaultAsync(x => x.Code == request.QuizCode);
                if (quiz == null)
                {
                    return null;
                }
                var quizQuestion = quiz.QuizQuestions.Find(x => x.Number == request.QuestionNo);
                if (quizQuestion == null)
                {
                    return null;
                }

                var contestantAnswers = new List<ContestantAnswer>();
                foreach (UpdateValues command in request.AnswerUpdates)
                {
                    var contestantAnswer = context.ContestantAnswers.SingleOrDefault(x => (x.ContestantId == command.ContestantId && x.QuizQuestionId == quizQuestion.Id));
                    if (contestantAnswer == null)
                    {
                        return null;
                    }
                    else
                    {
                        contestantAnswer.Correct = command.Correct;
                        contestantAnswer.Fastest = command.Fastest;
                        contestantAnswer.BonusPoints = command.BonusPoints;
                        contestantAnswer.Score = command.Score;
                        contestantAnswers.Add(contestantAnswer);
                    }
                }
                if (context.ChangeTracker.HasChanges())
                {
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return contestantAnswers;
                    }
                }
                else
                {
                    return contestantAnswers;
                }

                throw new Exception("There was a problem saving changes.");
            }
        }
    }
}