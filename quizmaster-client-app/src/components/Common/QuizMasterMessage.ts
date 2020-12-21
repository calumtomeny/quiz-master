interface QuizMasterMessage {
  start: boolean;
  complete: boolean;
  question: string;
  answer: string;
  questionNumber: number;
  kick: boolean;
}

export default QuizMasterMessage;
