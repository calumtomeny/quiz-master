import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AboutModal from "./AboutModal";
import ContactUsModal from "./ContactUsModal";
import EmailIcon from "@material-ui/icons/Email";
import CoffeeIcon from "@material-ui/icons/LocalCafe";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  aboutButton: {},
  aboutButtonBox: {
    alignSelf: "flex-end",
    display: "flex",
  },
  homePageIconButton: {
    "&:disabled": {
      color: "#ffffff",
    },
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
}));

export default function Header() {
  const classes = useStyles();
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [contactUsModalOpen, setContactUsModalOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleAboutModalOpen = () => {
    setAboutModalOpen(true);
  };
  const handleAboutModalClose = () => {
    setAboutModalOpen(false);
  };

  const handleContactUsModalOpen = () => {
    setContactUsModalOpen(true);
  };
  const handleContactUsModalClose = () => {
    setContactUsModalOpen(false);
  };

  const getHomePageUrl = () => {
    const url = window.location.href;
    const arr = url.split("/");
    return arr[0] + "//" + arr[2];
  };

  const iconButton = (
    <IconButton aria-label="contact" color="inherit" href={getHomePageUrl()}>
      <CoffeeIcon />
    </IconButton>
  );

  const homePageIconButton = (
    <IconButton
      aria-label="contact"
      color="inherit"
      disabled
      disableRipple
      className={classes.homePageIconButton}
    >
      <CoffeeIcon />
    </IconButton>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          {location.pathname == "/" ? homePageIconButton : iconButton}
          <Typography variant="h6" className={classes.title}>
            Quiz.Coffee
          </Typography>
          <IconButton
            aria-label="contact"
            color="inherit"
            onClick={handleContactUsModalOpen}
          >
            <EmailIcon />
          </IconButton>
          <Button
            type="button"
            color="inherit"
            className={classes.aboutButton}
            onClick={handleAboutModalOpen}
          >
            About
          </Button>
        </Toolbar>
      </AppBar>
      <AboutModal modalOpen={aboutModalOpen} onClose={handleAboutModalClose} />
      <ContactUsModal
        modalOpen={contactUsModalOpen}
        onClose={handleContactUsModalClose}
      />
    </>
  );
}
