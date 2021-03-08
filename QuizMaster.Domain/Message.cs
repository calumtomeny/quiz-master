namespace QuizMaster.Domain
{
    public class Message
    {
        public Message(string body)
        {
            this.Body = body;
        }
        public string Body { get; private set; }
    }
}