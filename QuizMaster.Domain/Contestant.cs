using System;
using System.Collections.Generic;

namespace QuizMaster.Domain
{
    public class Contestant
    {
        public Contestant(string name, Guid quizId)
        {
            Id = Guid.NewGuid();
            this.QuizId = quizId;
            Name = name;
            Score = 0;
            BonusPoints = 0;
        }

        public Guid Id { get; private set; }
        public String Name { get; private set; }
        public String Code { get; private set; }
        public Guid QuizId { get; set; }
        public List<ContestantAnswer> ContestantAnswers { get; set; }
        public int Score { get; set; }
        public int BonusPoints { get; set; }
    }
}
