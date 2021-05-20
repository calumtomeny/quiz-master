import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import "./Layout.css";
import { makeStyles } from "@material-ui/core";
import Header from "../../components/Common/Header";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(2),
  },
}));

export default function Layout(props: any) {
  const classes = useStyles();

  return (
    <div>
      <Header />
      <Container maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>{props.children}</div>
      </Container>
    </div>
  );
}
