import React, { useState, ChangeEvent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PeopleIcon from "@material-ui/icons/People";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import quiz from "./quiz.jpeg";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Copyright from "../Common/Copyright";
import { EPERM } from "constants";
import { Snackbar, SnackbarCloseReason } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${quiz})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function HomePage() {
  const history = useHistory();
  const classes = useStyles();

  const [quizName, setQuizName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [open, setOpen] = React.useState(false);

  const onHostQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Axios.post("http://localhost:5000/api/quizzes", {
      name: `${quizName}`,
    }).then((res) => {
      debugger;
      history.push(`/quiz/${res.data.id}/lobby`);
    });
  };

  const onJoinQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Axios.get(`http://localhost:5000/api/quizzes?quizCode=${quizCode}`).then(
      (res) => {
        if (!res.data.length) {
          setOpen(true);
        } else {
          console.log("ID:", res.data[0].id);
          history.push(`/quiz/${res.data[0].id}`);
        }
      }
    );
  };

  const handleClose = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onQuizNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuizName(e.currentTarget.value);
  const onQuizCodeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuizCode(e.currentTarget.value);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PostAddIcon />
          </Avatar>
          <form className={classes.form} onSubmit={onHostQuizSubmit}>
            <Typography component="h2" variant="h5">
              Host quiz
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="quiz-name"
              label="Quiz Name"
              name="quiz-name"
              autoFocus
              onChange={onQuizNameChange}
              value={quizName}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Host
            </Button>
          </form>
          <Avatar className={classes.avatar}>
            <PeopleIcon />
          </Avatar>
          <form className={classes.form} onSubmit={onJoinQuizSubmit}>
            <Typography component="h2" variant="h5">
              Join quiz
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="quiz-code"
              label="Quiz Code"
              id="quiz-code"
              onChange={onQuizCodeChange}
              value={quizCode}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Join
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Could not find quiz with specified code.
              </Alert>
            </Snackbar>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default HomePage;