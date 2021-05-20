import React, { ChangeEvent, KeyboardEvent } from "react";
import { Grid, TextField, Typography } from "@material-ui/core";
import QuizQuestion from "../../../../Common/QuizQuestion";

type QuestionProps = {
  quizQuestion: QuizQuestion;
  editingRow: boolean;
  deletingRow: boolean;
  editedQuizQuestion: QuizQuestion;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => void;
};

const Question = ({
  quizQuestion,
  editingRow,
  deletingRow,
  editedQuizQuestion,
  handleChange,
}: QuestionProps) => {
  const preventEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  return (
    <Grid item xs={12}>
      {editingRow ? (
        <TextField
          variant="outlined"
          margin="normal"
          size="small"
          multiline
          onKeyDown={(e) => preventEnter(e)}
          error={!editedQuizQuestion.question}
          fullWidth
          label={!editedQuizQuestion.question ? "Required" : "Question"}
          onChange={(e) => handleChange(e, "question")}
          value={editedQuizQuestion.question}
        />
      ) : deletingRow ? (
        <>
          <Typography variant="body1" color="error">
            Are you sure you want to delete this?
          </Typography>
        </>
      ) : (
        <Typography gutterBottom variant="body1">
          {quizQuestion.question}
        </Typography>
      )}
    </Grid>
  );
};

export default Question;
