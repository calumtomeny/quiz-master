import React, { useState, ChangeEvent } from "react";
import { Typography, TextField, Button } from "@material-ui/core";

export default function QuestionInitialiser(props: any) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const onQuestionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuestion(e.currentTarget.value);
  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onInitialQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onInitialQuestionSubmitted(question, answer);
  };

  return (
    <form onSubmit={onInitialQuestionSubmit} data-testid="create-question">
      <Typography component="h2" variant="h5" align="center">
        Create your first question
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="question"
        label="Question"
        name="question"
        autoFocus
        onChange={onQuestionChange}
        value={question}
        data-testid="question-input"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="answer"
        label="Answer"
        name="answer"
        autoFocus
        onChange={onAnswerChange}
        value={answer}
        data-testid="answer-input"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        data-testid="add-question-button"
      >
        ok
      </Button>
    </form>
  );
}
