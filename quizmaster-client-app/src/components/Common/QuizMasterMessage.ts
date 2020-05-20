interface QuizMasterMessage {
  start: boolean;
  complete: boolean;
  question: string;
  answer: string;
  questionNumber: number;
}

export default QuizMasterMessage;
