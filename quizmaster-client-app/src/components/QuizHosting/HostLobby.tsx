import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContestantList from "./ContestantList";
import "./HostLobby.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "./Contestant";

export default function HostLobby() {
  let { id } = useParams();
  const [contestants, setContestants] = useState<string[]>([]);

  useEffect(() => {
    // Build new Hub Connection, url is currently hard coded.
    const hubConnect = new HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(process.env.REACT_APP_BASE_API_URL + "/quiz")
      .build();

    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      axios
        .get(`/api/quizzes/${id}/contestants`)
        .then((res) => {
          setContestants(res.data.map((contestant: any) => contestant.name));
        })
        .then(async () => {
          try {
            await hubConnect
              .start()
              .then(() => console.log(hubConnect.state))
              .then(() => {
                console.log("Joining group...");
                hubConnect.invoke("AddToGroup", id);
                console.log("Connection successful!");
              })
              .catch(() => {
                console.log("Error adding to quiz group.");
              });

            hubConnect.on("ContestantUpdate", (contestant: Contestant) => {
              setContestants((c) => [...c, contestant.name]);
            });
          } catch (err) {
            alert(err);
          }
        });
    };
    createHubConnection();
    return () => {
      hubConnect.stop();
    };
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
