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
import QuizState from "../Common/QuizState";

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
  const [quizName, setQuizName] = useState("");
  const [answer, setAnswer] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
  const [quizInitialized, setQuizInitialized] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState(0);
  const [quizIsComplete, setQuizIsComplete] = useState(false);
  const [submitText, setSubmitText] = useState("Submit");
  const { quizId } = useParams<{ quizId: string }>();
  const [participantId, setParticipantId] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [contestantStandings, setContestantStandings] = useState<Contestant[]>(
    [],
  );
  const [pageError, setPageError] = useState(true);
  const [questionNo, setQuestionNo] = useState(0);
  const [awaitingFinalScores, setAwaitingFinalScores] = useState(false);

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAnswer(e.currentTarget.value);

  const onAnswerSubmit = () => {
    setAnswerSubmitted(true);
    const message: ParticipantMessage = {
      participantId: participantId,
      answer: answer,
      answerTimeLeftAsAPercentage: timeLeftAsAPercentage,
      questionNo: questionNo,
      answerTimeLeftInMs: Math.round(
        (timeLeftAsAPercentage / 100.0) * totalTimeInSeconds * 1000,
      ),
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
    //Set Participant ID
    const participantID = localStorage.getItem("participantId") || "";
    setParticipantId(participantID);

    //Get Quiz Details if the participant is a member of the quiz
    axios.get(`/api/quizzes/${quizId}/details/${participantID}`).then((res) => {
      setPageError(false);
      setQuizName(res.data.quizName);
      setQuestionNo(res.data.questionNo);
      if (
        res.data.quizState == QuizState.QuestionReady &&
        res.data.questionNo > 0
      ) {
        setQuizInitialized(true);
      } else if (res.data.quizState == QuizState.QuestionInProgress) {
        setQuizQuestion(
          new QuizQuestion(res.data.question, "", res.data.questionNo),
        );
        setTotalTimeInSeconds(120);
        setStartTime(res.data.questionStartTime);
        if (res.data.answer != "") {
          setAnswerSubmitted(true);
          setTimeLeftAsAPercentage(res.data.timeRemainingPerc);
          setAnswer(res.data.answer);
          setButtonDisabled(true);
          setSubmitText("Submitted. Please Wait.");
        } else {
          setAnswerSubmitted(false);
          setTimeLeftAsAPercentage(100);
          setAnswer("");
          setButtonDisabled(false);
          setSubmitText("Submit");
        }
      } else if (
        res.data.questionNo == 0 &&
        res.data.quizState == QuizState.QuestionReady
      ) {
        setAwaitingFinalScores(true);
      } else if (res.data.quizState == QuizState.QuizEnded) {
        setQuizIsComplete(true);
      }
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
            setQuestionNo(message.questionNumber);
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
            setQuestionNo(message.questionNumber);
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
      ) : pageError ? (
        <>
          <div className={classes.thankYou}>
            <h1>Oops! You&apos;re not supposed to be here</h1>
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
          <p>Get ready for question {questionNo}</p>
          <LinearProgress />
        </Box>
      ) : awaitingFinalScores ? (
        <Box mb={2}>
          <p>Get ready for the final scores</p>
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
