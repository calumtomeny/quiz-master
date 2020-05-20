import React, { useEffect, useState, ChangeEvent } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./QuestionResponder.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { LinearProgress } from "@material-ui/core";
import QuizMasterMessage from "../Common/QuizMasterMessage";
import QuizQuestion from "../Common/QuizQuestion";
import QuizQuestionDisplay from "../QuizHosting/QuizQuestionDisplay";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up("md")]: { marginTop: theme.spacing(8) },
    display: "flex",
    flexDirection: "column",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function QuestionResponder() {
  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
  const [quizInitialized, setQuizInitialized] = useState(false);
  let { quizId } = useParams();
  let { participantId } = useParams();

  debugger;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${quizId}`).then((res) => {
      setQuizCode(res.data.code);
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
  let { id } = useParams();

  return (
    <>
      <Typography component="h2" variant="h5">
        You're all set...
      </Typography>
      {quizInitialized && !quizQuestion ? (
        <>
          <p>The quiz is about to start, get ready!</p>
          <LinearProgress />
        </>
      ) : quizQuestion ? (
        <QuizQuestionDisplay quizQuestion={quizQuestion} />
      ) : (
        <p>The quiz will start soon.</p>
      )}
    </>
  );
}
