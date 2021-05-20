import {
  makeStyles,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Snackbar,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import QuestionCreator from "./QuestionCreator/QuestionCreator";
import HostLobby from "./HostLobby";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import QuizState from "../../Common/QuizState";
import ResetQuizModal from "./ResetQuizModal";
import StartQuizModal from "./StartQuizModal";
import QuizOptions from "./QuizOptions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  resetButton: {
    alignSelf: "flex-end",
    float: "right",
  },
  buttons: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  const [activeStep, setActiveStep] = useState<number>(0);
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const steps = getSteps();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const key = params.get("key");

  localStorage.setItem("apiKey", key ?? "");
  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("apiKey");
    config.headers.ApiKey = token;
    return config;
  });

  const [quizCode, setQuizCode] = useState<string>("");
  const [quizName, setQuizName] = useState<string>("");
  const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(false);
  const [resetAlertOpen, setResetAlertOpen] = useState<boolean>(false);
  const [refreshContestants, setRefreshContestants] = useState<boolean>(false);
  const [resetSuccessOpen, setResetSuccessOpen] = useState<boolean>(false);
  const [startQuizAlertOpen, setStartQuizAlertOpen] = useState<boolean>(false);
  const [contestantsArrived, setContestantsArrived] = useState<boolean>(false);
  const [questionTimeInSeconds, setQuestionTimeInSeconds] = useState<number>(
    10,
  );

  useEffect(() => {
    axios.get(`/api/quizzes/${id}`).then((res) => {
      setQuizCode(res.data.code);
      setQuizName(res.data.name);
      setQuestionTimeInSeconds(res.data.questionTimeInSeconds);
    });
  }, [id]);

  const updateNextButtonBasedOnQuestionCount = (questionCount: number) => {
    if (questionCount > 0) {
      setNextButtonEnabled(true);
    } else {
      setNextButtonEnabled(false);
    }
  };

  const onContestantArrival = () => {
    setContestantsArrived(true);
    if (activeStep === steps.length - 1) {
      setNextButtonEnabled(true);
    }
  };

  const onUpdateQuestionTime = (seconds: number) => {
    setQuestionTimeInSeconds(seconds);
  };

  const getStepContent = () => {
    return activeStep === 0 ? (
      <div className={classes.stepContainer}>
        <QuestionCreator
          quizId={id}
          onQuestionsUpdated={updateNextButtonBasedOnQuestionCount}
        />
      </div>
    ) : activeStep === 1 ? (
      <div className={classes.stepContainer}>
        <QuizOptions
          questionTimeInSeconds={questionTimeInSeconds}
          onUpdateQuestionTime={onUpdateQuestionTime}
        />
      </div>
    ) : (
      <div className={classes.stepContainer}>
        <HostLobby
          refreshContestants={refreshContestants}
          onContestantArrival={onContestantArrival}
        />
      </div>
    );
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const getQuizUrl = () => {
    const url = window.location.href;
    const arr = url.split("/");
    return (
      arr[0] +
      "//" +
      arr[2] +
      "/quiz/" +
      quizCode +
      "/" +
      encodeURIComponent(quizName)
    );
  };

  const getQuizMasterUrl = () => {
    const url = window.location.href;
    const arr = url.split("/");
    return (
      arr[0] +
      "//" +
      arr[2] +
      "/quiz/" +
      quizCode +
      "/" +
      quizName +
      "/setup?key=" +
      encodeURIComponent(String(key))
    );
  };

  const startQuiz = () => {
    setStartQuizAlertOpen(true);
  };

  const handleStartQuizAlertClose = () => {
    setStartQuizAlertOpen(false);
  };

  const handleCancelStartQuiz = () => {
    setStartQuizAlertOpen(false);
  };

  const handleConfirmStartQuiz = () => {
    setStartQuizAlertOpen(false);
    axios
      .post(`/api/quizzes/${id}`, {
        QuestionNo: 1,
        QuizState: QuizState.FirstQuestionReady,
      })
      .then(() => {
        history.push(`/quiz/${id}/${quizName}/host`);
      });
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      startQuiz();
    }

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    setSkipped(newSkipped);

    if (activeStep === steps.length - 2 && !contestantsArrived) {
      setNextButtonEnabled(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setNextButtonEnabled(true);
  };

  const handleReset = () => {
    setResetAlertOpen(true);
  };

  const handleResetAlertClose = () => {
    setResetAlertOpen(false);
  };

  const handleCancelReset = () => {
    setResetAlertOpen(false);
  };

  const updateQuizStateInitial = () => {
    axios.post(`/api/quizzes/${id}`, {
      QuestionNo: 0,
      QuizState: QuizState.QuizNotStarted,
    });
  };

  const handleConfirmReset = () => {
    setResetAlertOpen(false);
    axios.post(`/api/quizzes/${id}/resetcontestants`, {}).then(() => {
      setRefreshContestants(!refreshContestants);
      updateQuizStateInitial();
      setContestantsArrived(false);
      if (activeStep === steps.length - 1) {
        setNextButtonEnabled(false);
      }
      setResetSuccessOpen(true);
    });
  };

  const handleResetSuccessClose = () => {
    setResetSuccessOpen(false);
  };

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          {quizName}
        </Typography>
        <Typography component="h1" variant="h5">
          Quiz Joining Code: {id}
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        <Typography variant="body2" gutterBottom>
          Or simply give your friends the link to let them join:{" "}
          {quizName ? (
            <a data-testid="quiz-url" href={getQuizUrl()}>
              {getQuizUrl()}
            </a>
          ) : null}
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
        <div>
          {getStepContent()}
          <Box pt={3} pb={3}>
            <Typography variant="body2" gutterBottom>
              To come back to this quiz later as a Quiz Master, save the
              following link:
              <div>
                {quizName ? (
                  <a data-testid="quiz-master-url" href={getQuizMasterUrl()}>
                    {getQuizMasterUrl()}
                  </a>
                ) : null}
              </div>
            </Typography>
          </Box>
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
              disabled={!nextButtonEnabled}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? "Start Quiz" : "Next"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
              className={classes.resetButton}
            >
              Reset Participants
            </Button>
            <StartQuizModal
              open={startQuizAlertOpen}
              onClose={handleStartQuizAlertClose}
              handleCancelStart={handleCancelStartQuiz}
              handleConfirmStart={handleConfirmStartQuiz}
            />
            <ResetQuizModal
              open={resetAlertOpen}
              onClose={handleResetAlertClose}
              handleCancelReset={handleCancelReset}
              handleConfirmReset={handleConfirmReset}
            />
            <Snackbar
              open={resetSuccessOpen}
              autoHideDuration={6000}
              onClose={handleResetSuccessClose}
            >
              <Alert onClose={handleResetSuccessClose} severity="success">
                Quiz Participants Reset
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </div>
  );
}
