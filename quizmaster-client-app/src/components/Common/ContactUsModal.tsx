import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  aboutModalPaper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function AboutModal(props: any) {
  const classes = useStyles();
  return (
    <Dialog
      open={props.modalOpen}
      onClose={props.onClose}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">Contact Us</DialogTitle>
      <div className={classes.aboutModalPaper}>
        <Typography variant="body2" color="textSecondary" align="center">
          We&apos;d love to hear your feedback regarding bugs and suggestions.
          Please send us an email to the address below
        </Typography>
        <a href="mailto:quiz.coffee.app@gmail.com">quiz.coffee.app@gmail.com</a>
        {/*Commented until we create a privacy policy
          <br/>
          <Typography variant="body2" color="textSecondary" align="center">
          Privacy Policy
          </Typography>
          */}
      </div>
    </Dialog>
  );
}
