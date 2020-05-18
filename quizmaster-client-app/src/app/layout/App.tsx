import React from "react";
import { Route } from "react-router-dom";
import HomePage from "../../components/HomePage/HomePage";
import Layout from "./Layout";
import QuizWizard from "../../components/QuizHosting/QuizWizard";
import ContestantLobby from "../../components/QuizJoining/QuizSetup";

function App() {
const quizSetup: any = () => <Layout><QuizWizard/></Layout>;
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/quiz/:id/lobby" component={quizSetup} />
      <Route exact path="/quiz/:id" component={ContestantLobby} />
    </>
  );
}

export default App;
