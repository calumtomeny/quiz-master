import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "./HostLobby.css";
import { Paper, LinearProgress } from "@material-ui/core";

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

export default function QuizQuestionDisplay(props: any) {
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={3} className={classes.question}>
        <Typography component="h1" variant="h5">
          Question {props.quizQuestion.QuestionNumber}
        </Typography>
        {props.quizQuestion.Question}
      </Paper>
      <div className={classes.progressBar}>
        <LinearProgress
          variant="determinate"
          value={props.timeLeftAsAPercentage}
        />
      </div>
    </div>
  );
}
