import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";
import QuestionCreator from "./QuestionCreator";
import { useParams, useHistory } from "react-router-dom";
import HostLobby from "./HostLobby";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepContainer: {
    [theme.breakpoints.up("md")]: { minHeight: "420px" },
  },
}));

function getSteps() {
  return ["Create questions", "Set options", "Invite your friends"];
}

export default function QuizWizard() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  let { id } = useParams();
  const history = useHistory();

  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`/api/quizzes/${id}`).then((res) => {
      setQuizCode(res.data.code);
      setQuizName(res.data.name);
      setQuizId(res.data.id);
    });
  }, []);

  const getStepContent = () => {
    return activeStep === 0 ? (
      <div className={classes.stepContainer}>
        <QuestionCreator quizId={id} />
      </div>
    ) : activeStep === 1 ? (
      <div className={classes.stepContainer}>No options yet.</div>
    ) : (
      <div className={classes.stepContainer}>
        <HostLobby />
      </div>
    );
  };

  const isStepSkipped = (step: Number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      history.push(`/quiz/${id}/host`);
    }

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          {quizName}
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        <Typography variant="body2" gutterBottom>
          Give your friends the quiz code to let them join: <b>{quizCode}</b>
        </Typography>
      </Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps = { optional: {}, completed: false };
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {
          <div>
            {getStepContent()}
            <div className={classes.buttons}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Let's play!" : "Next"}
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
