import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  aboutHeader: {
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
  },
  createdBy: {
    marginTop: theme.spacing(0),
    textAlign: "center",
  },
  faqHeader: {
    margin: theme.spacing(4, 1, 1),
  },
  faqQuestion: {
    margin: theme.spacing(1, 1),
  },
  faqAnswer: {
    margin: theme.spacing(1, 1, 2),
  },
}));

export default function AboutModal(props: any) {
  const classes = useStyles();
  return (
    <Dialog
      open={props.modalOpen}
      onClose={props.onClose}
      aria-labelledby="simple-dialog-title"
      maxWidth="md"
    >
      <DialogTitle id="simple-dialog-title" className={classes.aboutHeader}>
        Quiz.Coffee - The Perfect App for Coffee Break Quizzes
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className={classes.createdBy}
        >
          Created by Calum Tomeny, Richard Lewis and Tim Loudon
        </DialogContentText>
        <Typography variant="h4" className={classes.faqHeader}>
          Frequently Asked Questions
        </Typography>
        <div>
          <Typography variant="h5" className={classes.faqQuestion}>
            Is this a silent quiz app?
          </Typography>
          <Typography variant="body2" className={classes.faqAnswer}>
            {`No. Quiz.Coffee is an app for socialising!
            Therefore it should be used in combination with web-meet tools such as Zoom, Google Meet, Teams etc;
            or if you're lucky enough for this to be allowed: in-person face to face!
            If you are a quiz master you can deliver the questions in your own style and make as big a show as you like!
            The app's main goal is to collect answers from contestants, count scores,
            and encourage speedy responses with bonus points (and also discouraging cheating!)`}
          </Typography>
        </div>
        <div>
          <Typography variant="h5" className={classes.faqQuestion}>
            Does the contestant have to type the answer exactly as the quiz
            master typed it?
          </Typography>
          <Typography variant="body2" className={classes.faqAnswer}>
            {`No. Although exact matches will be automatically marked as correct, the quiz master has the option
            of marking non-matches as correct if they deem it to be a good answer, they have complete discretion!`}
          </Typography>
        </div>
        <div>
          <Typography variant="h5" className={classes.faqQuestion}>
            Does the app support images and sound?
          </Typography>
          <Typography variant="body2" className={classes.faqAnswer}>
            {`Since the app is used in combination with web-meet tools, images, video and sound can be presented by
            the quiz master to the contestants over screen share. Placeholder questions can be used in the app
            such as "Image No 1" or "Song No 5" etc, so the app is still used to collect contestants'
            rapid responses to the visual/audio questions. The app does not currently allow images and sound to be embedded
            natively, but this is something we're considering for the future!`}
          </Typography>
        </div>
        <div>
          <Typography variant="h5" className={classes.faqQuestion}>
            Can the app be used for education?
          </Typography>
          <Typography variant="body2" className={classes.faqAnswer}>
            {`Absolutely! It can be a great tool for testing your students' knowledge with pop quizzes!`}
          </Typography>
        </div>
        {/*Commented until we create a privacy policy
          <br/>
          <Typography variant="body2" color="textSecondary" align="center">
          Privacy Policy
          </Typography>
          */}
      </DialogContent>
    </Dialog>
  );
}
