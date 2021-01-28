import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./QuizJoiner.css";
import QuizState from "../Common/QuizState";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up("md")]: { marginTop: theme.spacing(8) },
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  sorryText: {},
}));

export default function QuizJoiner() {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [quizName, setQuizName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [quizNotFound, setQuizNotFound] = useState<boolean>(false);
  const [joinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(false);
  const [participantNameExists, setParticipantNameExists] = useState<boolean>(
    false,
  );
  const [
    quizForParticipantAlreadyInProgress,
    setQuizForParticipantAlreadyInProgress,
  ] = useState<boolean>(false);
  const [
    quizAlreadyStartedWithoutParticipant,
    setQuizAlreadyStartedWithoutParticipant,
  ] = useState<boolean>(false);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);

  const goToTheQuizInProgress = () => {
    history.push(`/quiz/${id}`);
  };

  const onJoinQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJoinButtonDisabled(true);
    axios.get(`/api/quizzes/${id}/state`).then((res) => {
      if (res.data.quizState === QuizState.QuizNotStarted) {
        setQuizAlreadyStartedWithoutParticipant(false);
        axios
          .post("/api/contestants", {
            quizCode: `${id}`,
            contestantName: name,
          })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("participantId", res.data.id);
            localStorage.setItem("participantName", name);
            history.push(`/quiz/${id}`);
          })
          .catch(() => {
            setParticipantNameExists(true);
            setJoinButtonDisabled(false);
          });
      } else {
        setQuizAlreadyStartedWithoutParticipant(true);
      }
    });
  };

  useEffect(() => {
    // The participant might already be part of a quiz in progress so let's try and get their ID.
    const participantID = localStorage.getItem("participantId") || "";
    const participantName = localStorage.getItem("participantName") || "";

    // The user has been, or is a participant, let's check if they're a participant of this quiz.
    if (participantID) {
      axios
        .get(`/api/quizzes/${id}/details/${participantID}`)
        .then(() => {
          setQuizForParticipantAlreadyInProgress(true);
          setName(participantName);
        })
        .catch(() => {
          setQuizForParticipantAlreadyInProgress(false);
        });
    }

    async function loadQuiz() {
      try {
        const res = await axios.get(`/api/quizzes/${id}/name`);
        setQuizName(res.data);
      } catch (err) {
        if (err.response.status === 404) {
          setQuizNotFound(true);
        }
      }
    }
    loadQuiz();
  }, [id]);

  return (
    <>
      {quizNotFound ? (
        <Typography component="h2" variant="h5">
          Oops! The quiz was not found.
        </Typography>
      ) : quizForParticipantAlreadyInProgress ? (
        <Typography component="h2" variant="h5">
          &apos;{quizName}&apos;
        </Typography>
      ) : (
        <Typography component="h2" variant="h5">
          Joining &apos;{quizName}&apos;...
        </Typography>
      )}
      {quizForParticipantAlreadyInProgress ? (
        <Typography component="h5" variant="h6" color="primary">
          Hi {name}, you&apos;re already part of this quiz!
        </Typography>
      ) : participantNameExists ? (
        <Typography component="h5" variant="h6" color="primary">
          Hi, that name is already taken for this quiz, please try another one!
        </Typography>
      ) : (
        <></>
      )}
      {quizNotFound ? null : quizAlreadyStartedWithoutParticipant ? (
        <Typography className={classes.sorryText} color="primary">
          Sorry! The Quiz has already started. Please contact the Quiz Master if
          you would like to join.
        </Typography>
      ) : (
        <form className={classes.form} onSubmit={onJoinQuizSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            error={participantNameExists}
            required
            fullWidth
            id="your-name"
            label="Your Name"
            name="your-name"
            autoFocus
            onChange={onNameChange}
            value={name}
            data-testid="participant-name-input"
            disabled={quizForParticipantAlreadyInProgress}
          />
          {quizForParticipantAlreadyInProgress ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={goToTheQuizInProgress}
            >
              Get back to the action!
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={joinButtonDisabled}
            >
              Let&apos;s go!
            </Button>
          )}
        </form>
      )}
    </>
  );
}
