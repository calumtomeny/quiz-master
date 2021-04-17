import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function QuizInitiator(props: any) {
  const classes = useStyles();
  return (
    <>
      <p>
        Prepare your participants for the first question. The fastest correct
        answer will get a bonus point!
      </p>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={props.clickHandler}
      >
        Show first question...
      </Button>
    </>
  );
}
