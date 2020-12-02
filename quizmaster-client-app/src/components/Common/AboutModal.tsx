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
      <DialogTitle id="simple-dialog-title">Quick Quiz</DialogTitle>
      <div className={classes.aboutModalPaper}>
        <Typography variant="body2" color="textSecondary" align="center">
          Developed by Calum Tomeny, Richard Lewis and Tim Loudon
        </Typography>
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
