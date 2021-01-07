namespace QuizMaster.Domain
{
    public enum QuizState
    {
        QuizNotStarted,
        FirstQuestionReady,
        QuestionInProgress,
        NextQuestionReady,
        ResultsReady,
        QuizEnded,
    }
}