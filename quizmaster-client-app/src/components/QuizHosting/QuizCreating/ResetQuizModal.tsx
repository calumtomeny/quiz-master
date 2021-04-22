import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function ResetQuizModal(props: any) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Reset Quiz Participants?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will remove all participants from the quiz
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCancelReset} color="primary" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={props.handleConfirmReset}
          color="secondary"
          variant="contained"
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
