namespace QuizMaster.Application
{
    public class QuizMasterMessage
    {
        public bool Start { get; set; }
        public bool Complete { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public int QuestionNumber { get; set; }
        public bool Kick { get; set; }
    }
}   