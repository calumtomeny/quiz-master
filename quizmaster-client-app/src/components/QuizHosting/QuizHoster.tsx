import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContestantList from "./ContestantList";
import "./HostLobby.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "./Contestant";
import QuizMasterMessage from "../Common/QuizMasterMessage";

export default function QuizHoster() {
  let { id } = useParams();

  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`).then((res) => {
      setQuizName(res.data.name);
      setQuizId(res.data.id);
      setQuizCode(res.data.quizCode);

      const message: QuizMasterMessage = {
        start: true,
        question: "",
        answer: "",
        complete: false,
      };

      axios.post(
        `http://localhost:5000/api/quizzes/${id}/command/message`,
        message
      );
    });
    // const createHubConnection = async () => {
    //   // Build new Hub Connection, url is currently hard coded.
    //   const hubConnect = new HubConnectionBuilder()
    //     .withAutomaticReconnect()
    //     .withUrl("http://localhost:5000/quiz")
    //     .build();

    //   try {
    //     await hubConnect
    //       .start()
    //       .then(() => console.log(hubConnect.state))
    //       .then(() => {
    //         debugger;
    //         console.log("Joining group...");
    //         hubConnect.invoke("AddToGroup", id);
    //         console.log("Connection successful!");
    //       })
    //       .catch(() => {
    //         console.log("Error adding to quiz group.");
    //       });

    //     hubConnect.on("ContestantUpdate", (contestant: Contestant) => {
    //       setContestants((c) => [...c, contestant.name]);
    //     });
    //   } catch (err) {
    //     alert(err);
    //   }
    // };

    // createHubConnection();
  }, []);

  return (
    <>
      <Typography component="h1" variant="h5">
        {quizName}
      </Typography>
      <p>You are about to start the quiz.</p>
    </>
  );
}
