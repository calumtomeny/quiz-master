import React, { useState, useEffect, ChangeEvent } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Typography,
  TextField,
  Button,
  makeStyles,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    marginTop: "10px",
  },
  loadingCircle: {
    textAlign: "center",
    marginTop: "10px",
  },
});

export default function QuestionInitialiser(props: any) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);
  const [isInvalidQuestion, setIsInvalidQuestion] = useState(false);
  const [isInvalidAnswer, setIsInvalidAnswer] = useState(false);
  const [questionsLoadingInProgress, setQuestionsLoadingInProgress] = useState(
    false,
  );

  const classes = useStyles();

  const onQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.currentTarget.value);
  };
  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onCreateTenQuestions = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onCreateTenQuestions();
    setIsInitialQuestion(false);
  };

  const onQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      setIsInvalidQuestion(true);
      return;
    }
    if (question && !answer.trim()) {
      setIsInvalidAnswer(true);
      return;
    }
    setIsInvalidQuestion(true);
    setIsInvalidAnswer(true);
    props.onQuestionSubmitted(question, answer);
    setIsInitialQuestion(false);
    setQuestion("");
    setAnswer("");
  };

  useEffect(() => {
    setIsInitialQuestion(props.isInitialQuestion);
  }, []);

  useEffect(() => {
    setQuestionsLoadingInProgress(props.questionsLoadingInProgress);
  }, [props.questionsLoadingInProgress]);

  useEffect(() => {
    setIsInvalidQuestion(false);
  }, [question]);

  useEffect(() => {
    setIsInvalidAnswer(false);
  }, [answer]);

  return (
    <>
      <Typography component="h2" variant="h5" align="center">
        {isInitialQuestion
          ? "Create your first question"
          : "Add another question"}
      </Typography>
      <form onSubmit={onQuestionSubmit} data-testid="create-question">
        <TextField
          margin="normal"
          variant="outlined"
          label={isInvalidQuestion ? "Required" : "Question"}
          error={isInvalidQuestion}
          multiline
          fullWidth
          id="question"
          name="question"
          onChange={onQuestionChange}
          value={question}
          data-testid="question-input"
          autoComplete="off"
        />
        <TextField
          variant="outlined"
          fullWidth
          error={isInvalidAnswer}
          id="answer"
          label={isInvalidAnswer ? "Required" : "Answer"}
          name="answer"
          multiline
          onChange={onAnswerChange}
          value={answer}
          data-testid="answer-input"
          autoComplete="off"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={classes.button}
          color="primary"
          data-testid="add-question-button"
        >
          OK
        </Button>
      </form>
      {questionsLoadingInProgress ? (
        <div className={classes.loadingCircle}>
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
      {isInitialQuestion ? (
        <form onSubmit={onCreateTenQuestions} data-testid="create-question">
          <Box marginTop={4}>
            <Typography component="h2" variant="h5" align="center">
              Can&apos;t think of any questions?
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.button}
              color="default"
            >
              Create 10 questions to get me started!
            </Button>
          </Box>
        </form>
      ) : (
        <></>
      )}
    </>
  );
}
