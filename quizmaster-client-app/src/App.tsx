import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PeopleIcon from "@material-ui/icons/People";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import quiz from "./quiz.jpeg";
import { Route } from "react-router-dom";
import Chat from "./Chat";
import HomePage from "./HomePage/HomePage";

function App() {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/quiz/:id" component={Chat} />
    </>
  );
}

export default App;
