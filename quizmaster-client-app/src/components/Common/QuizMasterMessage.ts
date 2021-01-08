import Contestant from "../QuizHosting/Contestant";
import QuizState from "./QuizState";

interface QuizMasterMessage {
  state: QuizState;
  question: string;
  answer: string;
  questionNumber: number;
  kick: boolean;
  standings: Contestant[];
}

export default QuizMasterMessage;
