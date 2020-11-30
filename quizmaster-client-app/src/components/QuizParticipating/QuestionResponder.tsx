import React, { useEffect, useState, ChangeEvent } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./QuestionResponder.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  LinearProgress,
  TextField,
  Button,
  Paper,
  Box,
} from "@material-ui/core";
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
  thankYou: {
    textAlign: "center",
  },
}));

export default function QuestionResponder() {
  const classes = useStyles();
  const [quizName, setQuizName] = useState("");
  const [answer, setAnswer] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
  const [quizInitialized, setQuizInitialized] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState(0);
  const [quizIsComplete, setQuizIsComplete] = useState(false);
  const [submitText, setSubmitText] = useState("Submit");
  const { quizId } = useParams();
  const [participantId, setParticipantId] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onAnswerSubmit = () => {
    setAnswerSubmitted(true);
    const message: ParticipantMessage = {
      participantId: participantId,
      answer: answer,
      answerTime: timeLeftAsAPercentage
    };
    setSubmitText("Submitted. Please Wait.");
    axios.post(`/api/quizzes/${quizId}/command/participantmessage`, message);

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
    const participantID = localStorage.getItem("participantId") || "";
    setParticipantId(participantID);
  }, [participantId]);

  
  useEffect(() => {
    const interval = 100;
 
    function progress() {
      if(!answerSubmitted){
        setTimeLeftAsAPercentage((oldCompleted) => {
          let increment = 100*(Date.now() - startTime)/(totalTimeInSeconds*1000)
          return Math.max(100 - increment, 0);
          //return Math.max(oldCompleted - 1, 0);
        });
      }
    }
    const timer = setInterval(progress, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeftAsAPercentage]);

  useEffect(() => {
    axios.get(`/api/quizzes/${quizId}`).then((res) => {
      setQuizName(res.data.name);
    });

    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(process.env.REACT_APP_BASE_API_URL + "/quiz")
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
          if (message.start) {
            setQuizInitialized(true);
          } else if (message.complete) {
            setQuizIsComplete(true);
          } else {
            setQuizQuestion(
              new QuizQuestion(
                message.question,
                message.answer,
                message.questionNumber,
              ),
            );
            setTotalTimeInSeconds(120);
            setStartTime(Date.now());
            setAnswerSubmitted(false);
            setTimeLeftAsAPercentage(100);
            setAnswer("");
            setButtonDisabled(false);
            setSubmitText("Submit");
          }
        });
      } catch (err) {
        alert(err);
      }
    };
    createHubConnection();
  }, [quizId]);

  return (
    <>
      <Typography component="h2" variant="h5">
        {!quizIsComplete
          ? quizInitialized && !quizQuestion
            ? "You're all set..."
            : quizName
          : ""}
      </Typography>

      {quizIsComplete ? (
        <>
          <div className={classes.thankYou}>
            <h1>The quiz is over, thank you for playing!</h1>
          </div>
        </>
      ) : quizInitialized && !quizQuestion ? (
        <Box mb={2}>
          <p>The quiz is about to start, get ready!</p>
          <LinearProgress />
        </Box>
      ) : quizQuestion ? (
        <>
          <QuizQuestionDisplay
            quizQuestion={quizQuestion}
            timeLeftAsAPercentage={timeLeftAsAPercentage}
            totalTimeInSeconds={totalTimeInSeconds}
          />
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
              disabled={buttonDisabled || timeLeftAsAPercentage === 0}
            >
              {submitText}
            </Button>
          </Paper>
        </>
      ) : (
        <p>The quiz will start soon.</p>
      )}
    </>
  );
}
