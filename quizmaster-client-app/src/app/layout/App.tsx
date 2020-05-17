import React from "react";
import { Route } from "react-router-dom";
import HostLobby from "../../components/Lobby/HostLobby";
import HomePage from "../../components/HomePage/HomePage";
import ContestantLobby from "../../components/Lobby/ContestantLobby";

function App() {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/quiz/:id/lobby" component={HostLobby} />
      <Route exact path="/quiz/:id" component={ContestantLobby} />
    </>
  );
}

export default App;
