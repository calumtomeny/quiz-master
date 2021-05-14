import { TextField, Typography } from "@material-ui/core";
import React from "react";

export default function Answer(props: any) {
  return (
    <>
      {props.editingRow ? (
        <TextField
          variant="outlined"
          margin="normal"
          size="small"
          error={!props.editedQuizQuestion.answer}
          required
          fullWidth
          label={!props.editedQuizQuestion.answer ? "Required" : "Answer"}
          onChange={(e) => props.handleChange(e, "answer")}
          value={props.editedQuizQuestion.answer}
        />
      ) : props.deletingRow ? (
        <></>
      ) : (
        <Typography variant="body2">{props.quizQuestion.answer}</Typography>
      )}
    </>
  );
}
