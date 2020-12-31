import Layout from "./Layout";
import React from "react";
import QuizWizard from "../../components/QuizHosting/QuizWizard";
import QuizJoiner from "../../components/QuizParticipating/QuizJoiner";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "../../components/HomePage/HomePage";
import QuestionResponder from "../../components/QuizParticipating/QuestionResponder";
import QuizHoster from "../../components/QuizHosting/QuizHoster";
import NotFound from "../../components/Common/NotFound";

function App() {
  const quizSetup: any = () => (
    <Layout>
      <QuizWizard />
    </Layout>
  );
  const contestantJoin: any = () => (
    <Layout>
      <QuizJoiner />
    </Layout>
  );
  const questionResponder: any = () => (
    <Layout>
      <QuestionResponder />
    </Layout>
  );
  const quizHoster: any = () => (
    <Layout>
      <QuizHoster />
    </Layout>
  );
  const notFound: any = () => (
    <Layout>
      <NotFound />
    </Layout>
  );
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/quiz/:id/:name/setup" component={quizSetup} />
        <Route exact path="/quiz/:id/:name" component={contestantJoin} />
        <Route exact path="/quiz/:id/:name/host" component={quizHoster} />
        <Route exact path="/quiz/:quizId" component={questionResponder} />
        <Route component={notFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
