import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  questionField: {
    wordWrap: "break-word",
  },
  answerField: {
    flex: 1,
  },
  button: {
    margin: "10px 0 10px 10px",
  },
});

export default function QuestionInitialiser(props: any) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);

  const classes = useStyles();

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

  useEffect(() => {
    setIsInitialQuestion(props.isInitialQuestion);
  }, [props.isInitialQuestion]);

  return (
    <form onSubmit={onInitialQuestionSubmit} data-testid="create-question">
      <Typography component="h2" variant="h5" align="center">
        {isInitialQuestion
          ? "Create your first question"
          : "Add another question"}
      </Typography>
      <TextField
        margin="normal"
        variant="outlined"
        className={classes.questionField}
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
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-end"
      >
        <TextField
          variant="outlined"
          required
          className={classes.answerField}
          id="answer"
          label="Answer"
          name="answer"
          onChange={onAnswerChange}
          value={answer}
          data-testid="answer-input"
        />
        <Button
          type="submit"
          variant="contained"
          className={classes.button}
          color="primary"
          data-testid="add-question-button"
        >
          OK
        </Button>
      </Grid>
    </form>
  );
}
