using System;

namespace QuizMaster.Domain
{
    public class ExampleQuestion
    {
        public ExampleQuestion(string question, string answer)
        {
            Question = question;
            Answer = answer;
        }

        public Guid Id { get; private set; } 
        public String Question { get; private set; }
        public String Answer { get; private set; }
    }
}