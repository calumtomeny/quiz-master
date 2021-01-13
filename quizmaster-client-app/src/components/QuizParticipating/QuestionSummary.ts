interface QuestionSummary {
  number: number;
  question: string;
  correctAnswer: boolean;
  contestantAnswer: string;
  fastestContestantName: string;
  contestantIsFastest: boolean;
  score: number;
}

export default QuestionSummary;
