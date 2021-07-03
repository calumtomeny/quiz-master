import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Theme,
  useTheme,
} from "@material-ui/core";

export default function GenerateQuestionsModal(props: any) {
  const theme = useTheme<Theme>();
  const paperPropsStyle = {
    borderColor: theme.palette.primary.main,
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: paperPropsStyle,
      }}
    >
      <DialogTitle id="alert-dialog-title">
        {"Randomly Generate 10 Questions?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          WARNING: These questions were automatically sourced from the web and
          can sometimes be inaccurate and of poor quality. They can also be
          opinionated and culturally baised and these questions do not represent
          the views of Quiz.Coffee.
          <br />
          We recommend curating the questions in your quiz or better still, come
          up with your own :)
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCancelStart} color="primary" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={props.handleConfirmStart}
          color="primary"
          variant="contained"
        >
          Give me 10 questions!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
