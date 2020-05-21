import React, { useEffect, useState, ChangeEvent } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./QuestionResponder.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { LinearProgress, TextField, Button, Paper } from "@material-ui/core";
import QuizMasterMessage from "../Common/QuizMasterMessage";
import QuizQuestion from "../Common/QuizQuestion";
import QuizQuestionDisplay from "../QuizHosting/QuizQuestionDisplay";
import ParticipantMessage from "../Common/ParticipantMessage";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(4, 0, 4, 0),
    width: "80%",
  },
  textArea: {
    margin: theme.spacing(4, 0, 4, 0),
    width: "80%",
  },
  answer: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}));

export default function QuestionResponder() {
  const classes = useStyles();
  const [quizName, setQuizName] = useState("");
  const [answer, setAnswer] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
  const [quizInitialized, setQuizInitialized] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  let { quizId } = useParams();
  let { participantId } = useParams();

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onAnswerSubmit = () => {
    const message: ParticipantMessage = {
      participantId: participantId,   
      answer: answer,
    };
    axios.post(
      `http://localhost:5000/api/quizzes/${quizId}/command/participantmessage`,
      message
    );

    alert(answer);
    setButtonDisabled(true);
  };

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.charCode === 13) {
      onAnswerSubmit();
    }
    if (e.keyCode === 13) {
      onAnswerSubmit();
    }
  }
  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${quizId}`).then((res) => {
      setQuizName(res.data.name);
    });

    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl("http://localhost:5000/quiz")
        .build();

      try {
        await hubConnect
          .start()
          .then(() => console.log(hubConnect.state))
          .then(() => {
            console.log("Joining group...");
            hubConnect.invoke("AddToGroup", quizId);
            console.log("Connection successful!");
          })
          .catch(() => {
            console.log("Error adding to quiz group.");
          });

        hubConnect.on("ContestantUpdate", (message: QuizMasterMessage) => {
          debugger;
          if (message.start) {
            setQuizInitialized(true);
          } else if (message.complete) {
          } else {
            setQuizQuestion(
              new QuizQuestion(
                message.question,
                message.answer,
                message.questionNumber
              )
            );
          }
        });
      } catch (err) {
        alert(err);
      }
    };
    createHubConnection();
  }, []);

  return (
    <>
      <Typography component="h2" variant="h5">
        {quizInitialized && !quizQuestion ? "You're all set..." : quizName}
      </Typography>
      {quizInitialized && !quizQuestion ? (
        <>
          <p>The quiz is about to start, get ready!</p>
          <LinearProgress />
        </>
      ) : quizQuestion ? (
        <>
          <QuizQuestionDisplay quizQuestion={quizQuestion} />
          <Paper elevation={1} className={classes.answer}>
            <TextField
              autoFocus
              required
              id="standard-required"
              label="Answer"
              defaultValue=""
              className={classes.textArea}
              onChange={onAnswerChange}
              value={answer}
              onKeyPress={handleEnter}
            />
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.button}
              onClick={onAnswerSubmit}
              disabled={buttonDisabled}
            >
              Submit
            </Button>
          </Paper>
        </>
      ) : (
        <p>The quiz will start soon.</p>
      )}
    </>
  );
}
