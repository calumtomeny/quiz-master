class QuizQuestion {
  constructor(question: string, answer: string, number: number) {
    this.question = question;
    this.answer = answer;
    this.number = number;
  }
  question: string;
  answer: string;
  number: number;
}

export default QuizQuestion;
