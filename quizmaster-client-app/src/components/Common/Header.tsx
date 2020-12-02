import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core";
import AboutModal from "./AboutModal";

const useStyles = makeStyles(() => ({
  aboutButton: {},
  aboutButtonBox: {
    alignSelf: "flex-end",
  },
}));

export default function Header() {
  const classes = useStyles();
  const [aboutModalOpen, setAboutModalOpen] = React.useState(false);

  const handleAboutModalOpen = () => {
    setAboutModalOpen(true);
  };
  const handleAboutModalClose = () => {
    setAboutModalOpen(false);
  };

  return (
    <>
      <Box mb={2} className={classes.aboutButtonBox}>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          color="default"
          className={classes.aboutButton}
          onClick={handleAboutModalOpen}
        >
          About Quick Quiz
        </Button>
      </Box>
      <AboutModal modalOpen={aboutModalOpen} onClose={handleAboutModalClose} />
    </>
  );
}
