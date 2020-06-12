import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import "./Layout.css";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up("md")]: { marginTop: theme.spacing(8) },
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(2),
  },
}));

export default function Layout(props: any) {
  const classes = useStyles();

  return (
    <Container component={Paper} maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>{props.children}</div>
    </Container>
  );
}
