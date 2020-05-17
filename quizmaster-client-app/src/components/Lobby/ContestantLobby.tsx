import React, { useEffect, useState, ChangeEvent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../Common/Copyright";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ContestantList from "./ContestantList";
import { Paper } from "@material-ui/core";
import "./HostLobby.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "./Contestant";

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

export default function ContestantLobby() {
  const classes = useStyles();
  let { id } = useParams();

  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [name, setName] = useState("");

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);

  const onHostQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/contestants", {
        quizId: `${quizId}`,
        contestantName: name,
      })
      .then((res) => {
        console.log(res.status);
      });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`).then((res) => {
      setQuizCode(res.data.code);
      setQuizName(res.data.name);
      setQuizId(res.data.id);
    });
  }, []);

  return (
    <Container component={Paper} maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={onHostQuizSubmit}>
          <Typography component="h2" variant="h5">
            Quiz: {quizName}
          </Typography>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Let's go!
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
