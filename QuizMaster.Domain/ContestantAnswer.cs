using System;

namespace QuizMaster.Domain
{
    public class ContestantAnswer
    {
        public ContestantAnswer(Guid quizQuestionId, Guid contestantId, string answer, long timeRemainingMs, float percentageTimeRemaining, bool correct, bool fastest, int bonusPoints, int score)
        {
            this.QuizQuestionId = quizQuestionId;
            this.ContestantId = contestantId;
            this.Answer = answer;
            this.TimeRemainingMs = timeRemainingMs;
            this.PercentageTimeRemaining = percentageTimeRemaining;
            this.Correct = correct;
            this.Fastest = fastest;
            this.BonusPoints = bonusPoints;
            this.Score = score;
        }

        public Guid Id { get; private set; }
        public Guid QuizQuestionId { get; private set; }
        public Guid ContestantId { get; private set; }
        public String Answer { get; private set; }
        public long TimeRemainingMs { get; private set; }
        public float PercentageTimeRemaining { get; private set; }
        public bool Correct { get; set; }
        public bool Fastest { get; set; }
        public int BonusPoints { get; set; }
        public int Score { get; set; }
    }
}