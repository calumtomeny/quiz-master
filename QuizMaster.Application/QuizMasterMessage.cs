using System.Collections.Generic;
using QuizMaster.Domain;

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
        public List<ContestantScore> Standings { get; set; }
    }
}   