import Layout from "./Layout";
import React from "react";
import QuizWizard from "../../components/QuizHosting/QuizWizard";
import { Route } from "react-router-dom";
import HomePage from "../../components/HomePage/HomePage";
import ContestantLobby from "../../components/QuizParticipating/QuizSetup";

function App() {
const quizSetup: any = () => <Layout><QuizWizard/></Layout>;
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/quiz/:id/setup" component={quizSetup} />
      <Route exact path="/quiz/:id" component={ContestantLobby} />
    </>
  );
}

export default App;
