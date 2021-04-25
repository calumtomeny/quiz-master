import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "../Common/Contestant";
import ContestantList from "../Common/ContestantList";
import { Box, Typography } from "@material-ui/core";

export default function ParticipantLobby() {
  const { id } = useParams<{ id: string }>();
  const [contestants, setContestants] = useState<string[]>([]);
  const participantName = localStorage.getItem("participantName");

  const contestantList = contestants.filter((x) => x != participantName);

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
          if (res.data.length > 0) {
            console.log("Contestants set.");
          }
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

            hubConnect.on("ContestantJoined", (contestant: Contestant) => {
              console.log("Contestant joined: ", contestant.name);
              setContestants((c) => [...c, contestant.name]);
              console.log("Participant arrived.");
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
  }, [id]);

  return (
    <Box mb={2}>
      <Typography>The quiz will start soon...</Typography>
      {contestantList.length === 0 ? (
        <div>Waiting for others to join...</div>
      ) : (
        <>
          <Typography align="center" component="h2" variant="h6">
            Fellow quizzers
          </Typography>
          <ContestantList contestants={contestantList}></ContestantList>
        </>
      )}
    </Box>
  );
}
