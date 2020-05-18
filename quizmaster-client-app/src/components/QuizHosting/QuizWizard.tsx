import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";
import QuestionCreator from "./QuestionCreator";
import { useParams } from "react-router-dom";

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
}));

function getSteps() {
  return ["Create questions", "Set options", "Invite your friends"];
}

function getStepContent(step: Number) {
  switch (step) {
    case 0:
      return "Create questions for your quiz.";
    case 2:
      return "Invite people to your quiz.";
    default:
      return "Unknown step";
  }
}

export default function QuizWizard() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  let { id } = useParams();

  const isStepSkipped = (step: Number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
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

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          Quiz Name
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        <Typography variant="body2" gutterBottom>
          Give your friends the quiz code to let them join: <b>Quiz Code</b>
        </Typography>
      </Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
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
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            {activeStep === 0 ? <QuestionCreator quizId={id} /> : null}
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
        )}
      </div>
    </div>
  );
}
