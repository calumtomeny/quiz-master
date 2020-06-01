class QuizQuestion {
  constructor(question: string, answer: string, questionNumber: number) {
    this.Question = question;
    this.Answer = answer;
    this.QuestionNumber = questionNumber;
  }
  Question: string;
  Answer: string;
  QuestionNumber: number;
}

export default QuizQuestion;
