namespace QuizMaster.Application
{
    public class ParticipantMessage
    {
        public bool Start { get; set; }
        public bool Complete { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}