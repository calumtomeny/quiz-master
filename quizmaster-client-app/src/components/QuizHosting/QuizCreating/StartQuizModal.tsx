import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
  },
}));

export default function StartQuizModal(props: any) {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const paperPropsStyle = {
    //borderWidth: 5,
    //borderStyle: "solid",
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
      <DialogTitle id="alert-dialog-title" className={classes.dialogHeader}>
        {"START THE QUIZ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will start the quiz for all participants
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
          Let&apos;s Play!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
