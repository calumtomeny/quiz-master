import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "../QuizHosting/QuizCreating/HostLobby.css";
import { Paper, LinearProgress } from "@material-ui/core";
import QuizQuestion from "./QuizQuestion";

const useStyles = makeStyles((theme) => ({
  question: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  progressBar: {
    width: "100%",
    margin: theme.spacing(2, 0, 2, 0),
  },
}));

interface QuizQuestionDisplayProps {
  quizQuestion: QuizQuestion;
  timeLeftAsAPercentage: number;
  totalTimeInSeconds: number;
}

const QuizQuestionDisplay = ({
  quizQuestion,
  timeLeftAsAPercentage,
  totalTimeInSeconds,
}: QuizQuestionDisplayProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={3} className={classes.question}>
        <Typography component="h1" variant="h5">
          Question {quizQuestion.question}
        </Typography>
        {quizQuestion.question}
      </Paper>
      <div className={classes.progressBar}>
        <LinearProgress variant="determinate" value={timeLeftAsAPercentage} />
        <Typography component="h1" variant="h5">
          {((timeLeftAsAPercentage / 100.0) * totalTimeInSeconds).toFixed(2)}{" "}
          seconds remaining
        </Typography>
      </div>
    </div>
  );
};

export default QuizQuestionDisplay;
