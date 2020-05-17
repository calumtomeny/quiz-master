using System;

namespace QuizMaster.Domain
{
    public class Contestant
    {
        public Contestant(string name, Guid quizId)
        {
            Id = Guid.NewGuid();
            this.QuizId = quizId;
            Name = name;
        }

        public Guid Id { get; private set; }
        public String Name { get; private set; }
        public String Code { get; private set; }
        public Quiz Quiz { get; set; }
        public Guid QuizId { get; set; }
    }
}
