import React, { ChangeEvent } from "react";
import { TextField, Typography } from "@material-ui/core";
import QuizQuestion from "../../../../Common/QuizQuestion";

type AnswerProps = {
  quizQuestion: QuizQuestion;
  editingRow: boolean;
  deletingRow: boolean;
  editedQuizQuestion: QuizQuestion;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => void;
};

const Answer = ({
  quizQuestion,
  editingRow,
  deletingRow,
  editedQuizQuestion,
  handleChange,
}: AnswerProps) => {
  return (
    <>
      {editingRow ? (
        <TextField
          variant="outlined"
          margin="normal"
          size="small"
          error={!editedQuizQuestion.answer}
          required
          fullWidth
          label={!editedQuizQuestion.answer ? "Required" : "Answer"}
          onChange={(e) => handleChange(e, "answer")}
          value={editedQuizQuestion.answer}
        />
      ) : deletingRow ? (
        <></>
      ) : (
        <Typography variant="body2">{quizQuestion.answer}</Typography>
      )}
    </>
  );
};

export default Answer;
