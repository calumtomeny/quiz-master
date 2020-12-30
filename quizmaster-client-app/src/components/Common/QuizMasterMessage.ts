import Contestant from "../QuizHosting/Contestant";

interface QuizMasterMessage {
  start: boolean;
  complete: boolean;
  question: string;
  answer: string;
  questionNumber: number;
  kick: boolean;
  standings: Contestant[];
}

export default QuizMasterMessage;
