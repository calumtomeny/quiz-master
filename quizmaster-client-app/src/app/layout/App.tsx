import Layout from "./Layout";
import React from "react";
import QuizWizard from "../../components/QuizHosting/QuizWizard";
import QuizJoiner from "../../components/QuizParticipating/QuizJoiner";
import { Route } from "react-router-dom";
import HomePage from "../../components/HomePage/HomePage";
import QuestionResponder from "../../components/QuizParticipating/QuestionResponder";
import QuizHoster from "../../components/QuizHosting/QuizHoster";

function App() {
const quizSetup: any = () => <Layout><QuizWizard/></Layout>;
const contestantJoin: any = () => <Layout><QuizJoiner/></Layout>;
const questionResponder: any = () => <Layout><QuestionResponder/></Layout>;
const quizHoster: any = () => <Layout><QuizHoster/></Layout>;
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/quiz/:id/setup" component={quizSetup} />
      <Route exact path="/quiz/:id" component={contestantJoin} />
      <Route exact path="/quiz/:id/host" component={quizHoster} />
      <Route exact path="/quiz/:quizId/participants/:participantId" component={questionResponder} />
    </>
  );
}

export default App;
