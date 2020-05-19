interface QuizMasterMessage {
  start: boolean;
  complete: boolean;
  question: string;
  answer: string;
}

export default QuizMasterMessage;
