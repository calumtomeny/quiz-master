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
import Contestant from "../QuizHosting/Contestant";
import QuizStandings from "../QuizHosting/QuizStandings";

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
  finalStandings: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
}));

export default function QuestionResponder() {
  const classes = useStyles();
  const [quizName, setQuizName] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
  const [quizInitialized, setQuizInitialized] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState<number>(0);
  const [quizIsComplete, setQuizIsComplete] = useState<boolean>(false);
  const [submitText, setSubmitText] = useState<string>("Submit");
  const { quizId } = useParams();
  const [participantId, setParticipantId] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState<number>(0);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [kicked, setKicked] = useState<boolean>(false);
  const [contestantStandings, setContestantStandings] = useState<Contestant[]>(
    [],
  );

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onAnswerSubmit = () => {
    setAnswerSubmitted(true);
    const message: ParticipantMessage = {
      participantId: participantId,
      answer: answer,
      answerTimeLeftAsAPercentage: timeLeftAsAPercentage,
    };
    setSubmitText("Submitted. Please Wait.");
    axios.post(`/api/quizzes/${quizId}/command/participantmessage`, message);

    setButtonDisabled(true);
  };

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.charCode === 13 || e.keyCode === 13) && !answerSubmitted) {
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
      if (!answerSubmitted) {
        setTimeLeftAsAPercentage(() => {
          const increment =
            (100 * (Date.now() - startTime)) / (totalTimeInSeconds * 1000);
          return Math.max(100 - increment, 0);
        });
      }
    }
    const timer = setInterval(progress, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeftAsAPercentage]);

  useEffect(() => {
    axios.get(`/api/quizzes/${quizId}/name`).then((res) => {
      setQuizName(res.data);
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
            setContestantStandings(message.standings);
            setQuizIsComplete(true);
          } else if (message.kick) {
            console.log("Leaving group...");
            hubConnect.invoke("RemoveFromGroup", quizId);
            console.log("Connection removed");
            setKicked(true);
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

      {kicked ? (
        <>
          <div className={classes.thankYou}>
            <h1>You have been removed from the quiz. No hard feelings!</h1>
          </div>
        </>
      ) : quizIsComplete ? (
        <>
          <div className={classes.finalStandings}>
            <h2>{quizName}</h2>
            <h1>Final Standings</h1>
            <QuizStandings contestantStandings={contestantStandings} />
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
