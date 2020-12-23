import React from "react";
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

const useStyles = makeStyles((theme) => ({
  aboutButton: {},
  aboutButtonBox: {
    alignSelf: "flex-end",
    display: "flex",
  },
  mainIcon: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();
  const [aboutModalOpen, setAboutModalOpen] = React.useState(false);
  const [contactUsModalOpen, setContactUsModalOpen] = React.useState(false);

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

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            aria-label="contact"
            color="inherit"
            href={getHomePageUrl()}
          >
            <CoffeeIcon className={classes.mainIcon} />
          </IconButton>
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
