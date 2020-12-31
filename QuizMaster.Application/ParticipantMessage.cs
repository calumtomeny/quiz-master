using System;
namespace QuizMaster.Application
{
    public class ParticipantMessage
    {
        public Guid ParticipantId { get; set; }
        public string Answer { get; set; }
        public long AnswerTimeLeftInMs { get; set; }
        public float AnswerTimeLeftAsAPercentage { get; set; }
        public int QuestionNo { get; set; }
    }
}