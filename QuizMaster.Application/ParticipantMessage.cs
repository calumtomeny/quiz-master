using System;
namespace QuizMaster.Application
{
    public class ParticipantMessage
    {
        public Guid ParticipantId { get; set; }
        public string Answer { get; set; }
        public float AnswerTime { get; set; }
    }
}