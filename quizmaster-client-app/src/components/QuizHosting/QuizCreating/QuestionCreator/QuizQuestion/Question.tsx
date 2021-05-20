import React, { KeyboardEvent } from "react";
import { Grid, TextField, Typography } from "@material-ui/core";

export default function Question(props: any) {
  const preventEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  return (
    <Grid item xs={12}>
      {props.editingRow ? (
        <TextField
          variant="outlined"
          margin="normal"
          size="small"
          multiline
          onKeyDown={(e) => preventEnter(e)}
          error={!props.editedQuizQuestion.question}
          fullWidth
          label={!props.editedQuizQuestion.question ? "Required" : "Question"}
          onChange={(e) => props.handleChange(e, "question")}
          value={props.editedQuizQuestion.question}
        />
      ) : props.deletingRow ? (
        <>
          <Typography variant="body1" color="error">
            Are you sure you want to delete this?
          </Typography>
        </>
      ) : (
        <Typography gutterBottom variant="body1">
          {props.quizQuestion.question}
        </Typography>
      )}
    </Grid>
  );
}
