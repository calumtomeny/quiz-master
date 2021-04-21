import ContestantsSummary from "./ContestansSummary";

interface QuestionSummary {
  number: number;
  question: string;
  answer: string;
  contestants: Array<ContestantsSummary>;
}

export default QuestionSummary;
