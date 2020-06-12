import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./QuizJoiner.css";

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
}));

export default function QuizJoiner() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [quizName, setQuizName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [name, setName] = useState("");
  const [quizNotFound, setQuizNotFound] = useState(false);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);

  const onHostQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/api/contestants", {
        quizCode: `${quizCode}`,
        contestantName: name,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("participantId", res.data.id);
        history.push(`/quiz/${id}`);
      });
  };

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await axios.get(`/api/quizzes/${id}`);
        setQuizName(res.data.name);
        setQuizCode(res.data.code);
      } catch (err) {
        if (err.response.status === 404) {
          setQuizNotFound(true);
        }
      }
    }
    loadQuiz();
  }, []);

  return (
    <>
      {quizNotFound ? (
        <Typography component="h2" variant="h5">
          Oops! The quiz was not found.
        </Typography>
      ) : (
        <Typography component="h2" variant="h5">
          Joining &apos;{quizName}&apos;...
        </Typography>
      )}
      {quizNotFound ? null : (
        <form className={classes.form} onSubmit={onHostQuizSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="your-name"
            label="Your Name"
            name="your-name"
            autoFocus
            onChange={onNameChange}
            value={name}
            data-testid="participant-name-input"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Let&apos;s go!
          </Button>
        </form>
      )}
    </>
  );
}
