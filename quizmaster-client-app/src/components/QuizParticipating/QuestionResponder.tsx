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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import QuizMasterMessage from "../Common/QuizMasterMessage";
import QuizQuestion from "../Common/QuizQuestion";
import QuizQuestionDisplay from "../QuizHosting/QuizQuestionDisplay";
import ParticipantMessage from "../Common/ParticipantMessage";
import Contestant from "../QuizHosting/Contestant";
import QuizStandings from "../QuizHosting/QuizStandings";
import QuizState from "../Common/QuizState";
import FinalSummary from "./FinalSummary";

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
  const [isAnswerRequired, setIsAnswerRequired] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState<number>(0);
  const [quizIsComplete, setQuizIsComplete] = useState<boolean>(false);
  const [submitText, setSubmitText] = useState<string>("Submit");
  const { quizId } = useParams<{ quizId: string }>();
  const [participantId, setParticipantId] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState<number>(0);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [kicked, setKicked] = useState<boolean>(false);
  const [contestantStandings, setContestantStandings] = useState<Contestant[]>(
    [],
  );
  const [pageError, setPageError] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [questionNo, setQuestionNo] = useState(0);
  const [disconnectedDialogOpen, setDisconnectedDialogOpen] = useState<boolean>(
    false,
  );
  const [quizState, setQuizState] = useState(QuizState.QuizNotStarted);

  const apiBaseUrl = process.env.REACT_APP_BASE_API_URL;

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
    if (e.currentTarget.value) {
      setIsAnswerRequired(false);
    }
  };

  const onAnswerSubmit = () => {
    if (!answer) {
      setIsAnswerRequired(true);
      return;
    }
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

  const handleRefresh = () => {
    window.location.reload(false);
  };

  const handleCloseDisconnectedDialog = () => {
    setDisconnectedDialogOpen(false);
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
  }, [timeLeftAsAPercentage, answerSubmitted, startTime, totalTimeInSeconds]);

  useEffect(() => {
    //Set Participant ID
    const participantID = localStorage.getItem("participantId") || "";
    setParticipantId(participantID);

    //Get Quiz Details if the participant is a member of the quiz
    axios
      .get(`/api/quizzes/${quizId}/details/${participantID}`)
      .then((res) => {
        setPageError(false);
        setPageLoading(false);
        setQuizName(res.data.quizName);
        setQuestionNo(res.data.questionNo);
        if (res.data.quizState === QuizState.QuestionInProgress) {
          setQuizQuestion(
            new QuizQuestion(res.data.question, "", res.data.questionNo),
          );
          setTotalTimeInSeconds(45);
          setStartTime(res.data.questionStartTime);
          if (res.data.answer !== "") {
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
        } else if (res.data.quizState === QuizState.QuizEnded) {
          const newContestantStandings = res.data.contestantScores.map(
            (contestant: any) => {
              return {
                id: contestant.id,
                name: contestant.name,
                score: contestant.score,
                bonusPoints: contestant.bonusPoints,
              };
            },
          );
          setContestantStandings(newContestantStandings);
          setQuizIsComplete(true);
        }
        setQuizState(res.data.quizState);
      })
      .catch(() => {
        setPageError(true);
      });

    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withUrl(apiBaseUrl + "/quiz")
        .configureLogging("trace")
        .build();

      try {
        hubConnect.on("ContestantUpdate", (message: QuizMasterMessage) => {
          if (message.kick) {
            console.log("Leaving group...");
            hubConnect.invoke("RemoveFromGroup", quizId);
            console.log("Connection removed.");
            setKicked(true);
          } else if (message.state === QuizState.FirstQuestionReady) {
            setQuestionNo(message.questionNumber);
            setQuizState(message.state);
          } else if (message.state === QuizState.NextQuestionReady) {
            setQuestionNo(message.questionNumber);
            setQuizState(message.state);
          } else if (message.state === QuizState.ResultsReady) {
            setQuestionNo(0);
            setQuizState(message.state);
          } else if (message.state === QuizState.QuizEnded) {
            setContestantStandings(message.standings);
            setQuizIsComplete(true);
            setQuizState(message.state);
          } else {
            setQuizQuestion(
              new QuizQuestion(
                message.question,
                message.answer,
                message.questionNumber,
              ),
            );
            setQuestionNo(message.questionNumber);
            setTotalTimeInSeconds(45);
            setStartTime(Date.now());
            setAnswerSubmitted(false);
            setTimeLeftAsAPercentage(100);
            setAnswer("");
            setButtonDisabled(false);
            setSubmitText("Submit");
            setQuizState(message.state);
          }
        });
      } catch (err) {
        alert(err);
      }

      hubConnect.serverTimeoutInMilliseconds = 120000;

      const startSignalRConnection = (connection: any) =>
        connection
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

      hubConnect.onclose(() => {
        setDisconnectedDialogOpen(true);
      });

      startSignalRConnection(hubConnect);
    };
    createHubConnection();
  }, [quizId, apiBaseUrl]);

  return (
    <>
      <Typography component="h2" variant="h5">
        {(quizState === QuizState.FirstQuestionReady ||
          quizState === QuizState.NextQuestionReady) &&
        !kicked
          ? "You're all set..."
          : quizState !== QuizState.QuizEnded
          ? quizName
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
      ) : pageLoading ? (
        <>
          <div className={classes.thankYou}>
            <h1>Joining Quiz!</h1>
          </div>
        </>
      ) : quizIsComplete ? (
        <>
          <div className={classes.finalStandings}>
            <h2>{quizName}</h2>
            <h1>Final Standings</h1>
            <QuizStandings
              contestantStandings={contestantStandings}
              quizState={quizState}
            />
            <h2>Questions</h2>
            <FinalSummary participantId={participantId} />
          </div>
        </>
      ) : quizState === QuizState.FirstQuestionReady ||
        quizState === QuizState.NextQuestionReady ? (
        <Box mb={2}>
          <p>Get ready for question {questionNo}</p>
          <LinearProgress />
        </Box>
      ) : quizState === QuizState.ResultsReady ? (
        <Box mb={2}>
          <p>Get ready for the final scores</p>
          <LinearProgress />
        </Box>
      ) : quizState === QuizState.QuestionInProgress ? (
        <>
          <QuizQuestionDisplay
            quizQuestion={quizQuestion}
            timeLeftAsAPercentage={timeLeftAsAPercentage}
            totalTimeInSeconds={totalTimeInSeconds}
          />
          <Paper elevation={1} className={classes.answer}>
            <TextField
              required
              id="standard-required"
              label="Answer"
              defaultValue=""
              error={isAnswerRequired}
              helperText={isAnswerRequired ? "Please type an answer" : ""}
              className={classes.textArea}
              onChange={onAnswerChange}
              value={answer}
              onKeyPress={handleEnter}
              autoComplete="off"
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
      <Dialog
        open={disconnectedDialogOpen}
        onClose={handleCloseDisconnectedDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You've lost the connection to the server"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The connection to the server was lost, refresh the page to attempt
            to reconnect.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisconnectedDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRefresh} color="primary" autoFocus>
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
