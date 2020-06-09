using System;

namespace QuizMaster.Domain
{
    public class QuizQuestion
    {
        public QuizQuestion(string question, string answer, Guid quizId, int number)
        {
            this.Number = number;
            QuizId = quizId;
            Question = question;
            Answer = answer;
        }

        public Guid Id { get; private set; }
        public Guid QuizId { get; private set; }
        public String Question { get; private set; }
        public String Answer { get; private set; }
        public int Number { get; set; }
    }
}