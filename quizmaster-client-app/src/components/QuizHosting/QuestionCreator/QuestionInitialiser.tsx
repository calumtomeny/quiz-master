import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Typography, TextField, Button } from "@material-ui/core";

export default function QuestionInitialiser(props: any) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onQuestionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuestion(e.currentTarget.value);
  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onInitialQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onInitialQuestionSubmitted(question, answer);
    setIsInitialQuestion(false);
    setQuestion("");
    setAnswer("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  return (
    <form onSubmit={onInitialQuestionSubmit} data-testid="create-question">
      <Typography component="h2" variant="h5" align="center">
        {isInitialQuestion
          ? "Create your first question"
          : "Add another question"}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="question"
        label="Question"
        name="question"
        autoFocus
        inputRef={inputRef}
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
