import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import React from "react";
import AboutModal from "./AboutModal";

const useStyles = makeStyles((theme) => ({
  aboutButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Footer() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Button
        type="button"
        fullWidth
        variant="outlined"
        color="default"
        className={classes.aboutButton}
        onClick={handleModalOpen}
      >
        About Quick Quiz
      </Button>
      <AboutModal modalOpen={modalOpen} onClose={handleModalClose} />
    </div>
  );
}
