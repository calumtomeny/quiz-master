import React, { useEffect, useState } from "react";
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

export default function HostLobby() {
  const classes = useStyles();
  let { id } = useParams();
  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [contestants, setContestants] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`).then((res) => {
      setQuizCode(res.data.code);
      setQuizName(res.data.name);
      setQuizId(res.data.id);
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
            debugger;
            console.log("Joining group...");
            hubConnect.invoke("AddToGroup", id);
            console.log("Connection successful!");
          })
          .catch(() => {
            console.log("Error adding to quiz group.");
          });

        hubConnect.on("ContestantUpdate", (contestant: Contestant) => {
          debugger;
          setContestants((c) => [...c, contestant.name]);
        });
      } catch (err) {
        alert(err);
      }
      //setHubConnection(hubConnect);
    };

    createHubConnection();
  }, []);

  return (
    <>
      <Typography component="h1" variant="h6">
        Lobby
      </Typography>
      {contestants.length == 0 ? (
        <p>Your friends will appear here when they have joined.</p>
      ) : (
        <ContestantList contestants={contestants} />
      )}
    </>
  );
}
