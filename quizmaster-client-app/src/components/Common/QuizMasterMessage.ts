import Contestant from "./Contestant";
import QuizState from "./QuizState";

interface QuizMasterMessage {
  state: QuizState;
  question: string;
  answer: string;
  questionNumber: number;
  kick: boolean;
  standings: Contestant[];
  questionTimeInSeconds: number;
}

export default QuizMasterMessage;
