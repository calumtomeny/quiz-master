import React, { useState, ChangeEvent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CoffeeIcon from "@material-ui/icons/LocalCafeOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import coffeeAndLaptop from "./coffee-and-laptop.jpg";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Snackbar, SnackbarCloseReason } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import "../../stringUtilities";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${coffeeAndLaptop})`,
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
  avatarHost: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  avatarJoin: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
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

  const [quizName, setQuizName] = useState<string>("");
  const [quizCode, setQuizCode] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);

  const onHostQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Axios.post("/api/quizzes", {
      name: `${quizName}`,
    }).then((res) => {
      history.push(
        `/quiz/${
          res.data.code
        }/${res.data.name.toUrlFormat()}/setup?key=${encodeURIComponent(
          res.data.key,
        )}`,
      );
    });
  };

  const onJoinQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Axios.get(`/api/quizzes/${quizCode}/name`)
      .then((res) => {
        if (!res.data) {
          setSnackbarOpen(true);
        } else {
          history.push(`/quiz/${quizCode}/${res.data.toUrlFormat()}`);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setSnackbarOpen(true);
        }
      });
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onQuizNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuizName(e.currentTarget.value);
  const onQuizCodeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuizCode(e.currentTarget.value.toUpperCase());

  return (
    <div>
      <Header />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatarJoin}>
              <CoffeeIcon />
            </Avatar>
            <form
              className={classes.form}
              onSubmit={onJoinQuizSubmit}
              data-testid="join-quiz"
            >
              <Typography component="h1" variant="h5" align="center">
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
                data-testid="quiz-code-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                data-testid="join-quiz-button"
              >
                Join
              </Button>
            </form>
            <Avatar className={classes.avatarHost}>
              <PostAddIcon />
            </Avatar>
            <form
              className={classes.form}
              onSubmit={onHostQuizSubmit}
              data-testid="host-quiz"
            >
              <Typography component="h2" variant="h5" align="center">
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
                data-testid="quiz-name-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                data-testid="create-quiz-button"
              >
                Host
              </Button>
            </form>
            <Box mt={2}>
              <Footer />
            </Box>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert onClose={handleSnackbarClose} severity="error">
                Could not find quiz with specified code.
              </Alert>
            </Snackbar>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomePage;
