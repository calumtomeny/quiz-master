import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import "./Layout.css";
import Copyright from "../../components/Common/Copyright";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up("md")]: { marginTop: theme.spacing(8) },
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Layout(props: any) {
  const classes = useStyles();

  return (
    <Container component={Paper} maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>{props.children}</div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
