import React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function QuizInitiator(props: any) {
  const classes = useStyles();
  return (
    <>
      <p>You are about to start the quiz.</p>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={props.clickHandler}
      >
        Go to the first question...
      </Button>
    </>
  );
}
