interface ParticipantMessage {
  participantId: string;
  answer: string;
  answerTimeLeftAsAPercentage: number;
  answerTimeLeftInMs: number;
  questionNo: number;
}

export default ParticipantMessage;
