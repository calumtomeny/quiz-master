import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import "./HostLobby.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "./Contestant";
import QuizMasterMessage from "../Common/QuizMasterMessage";
import Button from "@material-ui/core/Button";
import QuizQuestion from "../Common/QuizQuestion";
import QuizInitiator from "./QuizInitiator";
import { Box, Paper } from "@material-ui/core";
import QuizQuestionDisplay from "./QuizQuestionDisplay";
import QuestionMarker from "./QuestionMarker";
import Data from "./QuestionResponse";
import ParticipantMessage from "../Common/ParticipantMessage";
import QuizStandings from "./QuizStandings";
import QuestionResponse from "./QuestionResponse";
import ContestantAnswerScore from "./ContestantAnswerScore";
import QuizState from "../Common/QuizState";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    minHeight: "15rem",
    textAlign: "center",
  },
  nextQuestion: {
    verticalAlign: "middle",
    marginTop: theme.spacing(10),
  },
  finalStandings: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
}));

export default function QuizHoster() {
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const history = useHistory();
  const [quizName, setQuizName] = useState<string>("");
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState<number>(0);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [showQuizMarker, setShowQuizMarker] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Data[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<QuizQuestion>(
    new QuizQuestion("", "", 0),
  );
  const [currentQuizState, setCurrentQuizState] = useState<QuizState>(
    QuizState.QuizNotStarted,
  );
  const [finalQuestionCompleted, setFinalQuestionCompleted] = useState<boolean>(
    false,
  );

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("apiKey");
    config.headers.ApiKey = token;
    return config;
  });

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------UTILITY FUNCTIONS-------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  const isFinalQuestion = () => currentQuestionNumber === quizQuestions.length;

  const getQuizQuestion = (questionNumber: number) => {
    const question = quizQuestions.find(
      (x) => x.QuestionNumber === questionNumber,
    );
    return question;
  };

  const roundIsComplete = () =>
    timeLeftAsAPercentage === 0 || answers.length === contestants.length;

  function getContestantScoreForRound(
    scores: ContestantAnswerScore[],
    contestantId: string,
  ): number {
    return scores.find((x) => x.ContestantId == contestantId)?.Score ?? 0;
  }

  function getContestantBonusPointsForRound(
    scores: ContestantAnswerScore[],
    contestantId: string,
  ): number {
    return scores.find((x) => x.ContestantId == contestantId)?.BonusPoints ?? 0;
  }

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------ACTION FUNCTIONS--------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  const updateQuizStateReady = () => {
    const nextQuestionNumber = currentQuestionNumber + 1;
    setCurrentQuestionNumber(nextQuestionNumber);
    setCurrentQuizQuestion(
      getQuizQuestion(nextQuestionNumber) ?? new QuizQuestion("", "", 0),
    );
    axios.post(`/api/quizzes/${id}`, {
      QuestionNo: currentQuestionNumber + 1,
      QuizState: QuizState.NextQuestionReady,
    });
  };

  const updateQuizStateInProgress = () => {
    axios.post(`/api/quizzes/${id}`, {
      QuizState: QuizState.QuestionInProgress,
      QuestionStartTime: Date.now(),
    });
  };

  const updateQuizStatePendingResults = () => {
    setCurrentQuizQuestion(new QuizQuestion("", "", 0));
    setCurrentQuestionNumber(0);
    setFinalQuestionCompleted(true);
    axios.post(`/api/quizzes/${id}`, {
      QuestionNo: 0,
      QuizState: QuizState.ResultsReady,
    });
  };

  const updateQuizStateFinished = () => {
    axios.post(`/api/quizzes/${id}`, { QuizState: QuizState.QuizEnded });
  };

  const messageContestantsQuestionStart = () => {
    const quizQuestion = getQuizQuestion(currentQuestionNumber);
    const message: QuizMasterMessage = {
      state: QuizState.QuestionInProgress,
      question: quizQuestion?.Question ?? "",
      answer: "",
      questionNumber: quizQuestion?.QuestionNumber ?? 1,
      kick: false,
      standings: [],
    };

    axios.post(`/api/quizzes/${id}/command/quizmastermessage`, message);
    setTotalTimeInSeconds(45);
    setQuestionStartTime(Date.now());
    setTimeLeftAsAPercentage(100);
  };

  const messageContestantsQuestionReady = () => {
    const message: QuizMasterMessage = {
      state: QuizState.NextQuestionReady,
      question: "",
      answer: "",
      questionNumber: currentQuestionNumber + 1,
      kick: false,
      standings: [],
    };

    axios.post(`/api/quizzes/${id}/command/quizmastermessage`, message);
  };

  const messageContestantsPendingResults = () => {
    const message: QuizMasterMessage = {
      state: QuizState.ResultsReady,
      question: "",
      answer: "",
      questionNumber: 0,
      kick: false,
      standings: [],
    };

    axios.post(`/api/quizzes/${id}/command/quizmastermessage`, message);
  };

  const onQuizInitiate = () => {
    axios
      .post(`/api/quizzes/${id}`, {
        QuestionNo: 1,
        QuizState: QuizState.QuestionInProgress,
        QuestionStartTime: Date.now(),
      })
      .then(() => {
        messageContestantsQuestionStart();
      });
    setCurrentQuizState(QuizState.QuestionInProgress);
  };

  const onGoToNextQuestion = () => {
    if (finalQuestionCompleted) {
      const message: QuizMasterMessage = {
        state: QuizState.QuizEnded,
        question: "",
        answer: "",
        questionNumber: 0,
        kick: false,
        standings: contestants,
      };
      updateQuizStateFinished();
      axios
        .post(`/api/quizzes/${id}/command/quizmastermessage`, message)
        .then(() => {
          setShowQuizMarker(false);
          setCurrentQuizState(QuizState.QuizEnded);
        });
    } else {
      setShowQuizMarker(true);
      setAnswers([]);
      messageContestantsQuestionStart();
      updateQuizStateInProgress();
      setCurrentQuizState(QuizState.QuestionInProgress);
    }
  };

  const onAcceptAnswers = (correctResponses: QuestionResponse[]) => {
    //Loop through responses to determine fastest answer
    let fastestContestant = "";
    let fastestContestantTimeLeft = 0;
    correctResponses.forEach((response) => {
      if (response.answerTimeLeftAsAPercentage > fastestContestantTimeLeft) {
        fastestContestantTimeLeft = response.answerTimeLeftAsAPercentage;
        fastestContestant = response.id;
      }
    });

    //Loop through responses to build scores
    const roundScores: ContestantAnswerScore[] = [];

    correctResponses.forEach((response) => {
      let fastest = false;
      let score = 1;
      if (response.id == fastestContestant) {
        score = 2;
        fastest = true;
      }
      const contestantAnswerScore: ContestantAnswerScore = {
        ContestantId: response.id,
        Correct: true,
        Fastest: fastest,
        Score: score,
        BonusPoints: score - 1,
      };
      roundScores.push(contestantAnswerScore);
    });

    const updatedContestants = contestants.map((contestant) => {
      return {
        ...contestant,
        score:
          contestant.score +
          getContestantScoreForRound(roundScores, contestant.id),
        bonusPoints:
          contestant.bonusPoints +
          getContestantBonusPointsForRound(roundScores, contestant.id),
      };
    });
    setContestants(updatedContestants);
    const updateCommands = updatedContestants.map((contestant) => {
      return {
        ContestantId: contestant.id,
        Update: {
          Score: contestant.score,
          BonusPoints: contestant.bonusPoints,
        },
      };
    });
    const answersUpdateCommand = {
      QuestionNo: currentQuestionNumber,
      AnswerUpdates: roundScores,
    };
    axios
      .post(`/api/quizzes/${id}/updatecontestantanswers`, answersUpdateCommand)
      .then(() => {
        axios.post(`/api/contestants/updates`, updateCommands).then(() => {
          setShowQuizMarker(false);
        });
      });
    if (isFinalQuestion()) {
      updateQuizStatePendingResults();
      messageContestantsPendingResults();
      setCurrentQuizState(QuizState.ResultsReady);
    } else {
      updateQuizStateReady();
      messageContestantsQuestionReady();
      setCurrentQuizState(QuizState.NextQuestionReady);
    }
  };

  const returnToQuizSetup = () => {
    axios
      .post(`/api/quizzes/${id}`, {
        QuestionNo: 0,
        QuizState: QuizState.QuizNotStarted,
      })
      .then(() => {
        const token = localStorage.getItem("apiKey");
        history.push(
          `/quiz/${id}/${quizName.toUrlFormat()}/setup?key=${encodeURIComponent(
            String(token),
          )}`,
        );
      });
  };

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //------------------------------USE EFFECTS----------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  useEffect(() => {
    const interval = 100;

    function progress() {
      if (!roundIsComplete()) {
        setTimeLeftAsAPercentage(() => {
          const increment =
            (100 * (Date.now() - questionStartTime)) /
            (totalTimeInSeconds * 1000);
          return Math.max(100 - increment, 0);
        });
      }
    }

    const timer = setInterval(progress, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeftAsAPercentage]);

  useEffect(() => {
    //useEffect on 'id' state variable. This code will run when the page is first loaded or refreshed
    let contestantsList: Contestant[] = [];
    axios.get(`/api/quizzes/${id}/details`).then((res) => {
      setQuizName(res.data.quizName);
      const totalTimeInSecs = 45;
      setTotalTimeInSeconds(totalTimeInSecs);

      contestantsList = res.data.contestants.map((contestant: any) => {
        return {
          name: contestant.name,
          id: contestant.id,
          score: contestant.score,
          bonusPoints: contestant.bonusPoints,
        } as Contestant;
      });
      setContestants(contestantsList);

      setQuizQuestions(() =>
        res.data.questions.map(
          (x: any) => new QuizQuestion(x.question, x.answer, x.number),
        ),
      );

      if (res.data.quizState === QuizState.QuizEnded) {
        setCurrentQuizQuestion(new QuizQuestion("", "", 0));
      } else {
        setCurrentQuizQuestion(() => {
          const question = res.data.questions.find(
            (x: any) => x.number === res.data.currentQuestionNo,
          );
          if (question) {
            return new QuizQuestion(
              question.question,
              question.answer,
              question.number,
            );
          } else {
            return new QuizQuestion("", "", 0);
          }
        });
      }

      setCurrentQuestionNumber(res.data.currentQuestionNo);
      setCurrentQuizState(res.data.quizState);

      if (
        res.data.currentQuestionNo == 1 &&
        res.data.quizState == QuizState.FirstQuestionReady
      ) {
        const message: QuizMasterMessage = {
          state: QuizState.FirstQuestionReady,
          question: "",
          answer: "",
          questionNumber: 1,
          kick: false,
          standings: [],
        };
        axios.post(`/api/quizzes/${id}/command/quizmastermessage`, message);
      } else if (res.data.quizState == QuizState.QuestionInProgress) {
        setShowQuizMarker(true);
        setAnswers(() =>
          res.data.currentContestantAnswers.map((x: any) => {
            return {
              answer: x.answer,
              id: x.contestantId,
              name: contestantsList.filter((y) => y.id === x.contestantId)[0]
                .name,
              answerTimeLeftAsAPercentage: x.percentageTimeRemaining,
            };
          }),
        );
        setQuestionStartTime(res.data.currentQuestionStartTime);
        setTimeLeftAsAPercentage(() => {
          const increment =
            (100 * (Date.now() - res.data.currentQuestionStartTime)) /
            (totalTimeInSecs * 1000);
          return Math.max(100 - increment, 0);
        });
      } else if (res.data.quizState === QuizState.ResultsReady) {
        setShowQuizMarker(false);
        setFinalQuestionCompleted(true);
      } else if (res.data.quizState === QuizState.NextQuestionReady) {
        setShowQuizMarker(false);
      } else if (res.data.quizState == QuizState.QuizEnded) {
        setShowQuizMarker(false);
        setFinalQuestionCompleted(true);
      }
    });

    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(process.env.REACT_APP_BASE_API_URL + "/quiz")
        .build();

      try {
        await hubConnect
          .start()
          .then(() => console.log(hubConnect.state))
          .then(() => {
            console.log("Joining group...");
            hubConnect.invoke("AddToGroup", id);
            console.log("Connection successful!");
          })
          .catch(() => {
            console.log("Error adding to quiz group.");
          });

        hubConnect.on("QuizMasterUpdate", (message: ParticipantMessage) => {
          setAnswers((answers) => [
            ...answers,
            {
              answer: message.answer,
              id: message.participantId,
              name: contestantsList.filter(
                (x) => x.id === message.participantId,
              )[0].name,
              answerTimeLeftAsAPercentage: message.answerTimeLeftAsAPercentage,
            },
          ]);
        });
      } catch (err) {
        alert(err);
      }
    };
    createHubConnection();
  }, [id]);

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //----------------------------------RENDER-----------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          {quizName}
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        {currentQuizState === QuizState.FirstQuestionReady ? (
          <QuizInitiator quizName={quizName} clickHandler={onQuizInitiate} />
        ) : (
          <>
            {currentQuizState === QuizState.QuestionInProgress ? (
              <>
                <QuizQuestionDisplay
                  quizQuestion={currentQuizQuestion}
                  timeLeftAsAPercentage={timeLeftAsAPercentage}
                  totalTimeInSeconds={totalTimeInSeconds}
                />
                <Typography component="h1" variant="h5">
                  Answer: {currentQuizQuestion.Answer}
                </Typography>
              </>
            ) : currentQuizState === QuizState.NextQuestionReady ? (
              <>
                <Typography component="h1" variant="h5">
                  Get ready for Question {currentQuestionNumber}!
                </Typography>
              </>
            ) : currentQuizState === QuizState.ResultsReady ? (
              <>
                <Typography component="h1" variant="h5">
                  The Final Results are Ready
                </Typography>
              </>
            ) : (
              <></>
            )}
            {currentQuizState != QuizState.QuizEnded ? (
              <>
                <Paper className={classes.paper}>
                  {showQuizMarker ? (
                    <QuestionMarker
                      rows={answers}
                      answer={currentQuizQuestion.Answer ?? ""}
                      onAcceptAnswers={onAcceptAnswers}
                      showContinueAction={roundIsComplete()}
                    />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.nextQuestion}
                      onClick={onGoToNextQuestion}
                    >
                      {currentQuizState === QuizState.ResultsReady
                        ? "Show Final Standings"
                        : "Start Question " + currentQuestionNumber}
                    </Button>
                  )}
                </Paper>
                <Typography component="h1" variant="h5">
                  Quiz Standings
                </Typography>
                <QuizStandings
                  contestantStandings={contestants}
                  quizState={currentQuizState}
                />
              </>
            ) : (
              <div className={classes.finalStandings}>
                <h1>Final Standings</h1>
                <QuizStandings
                  contestantStandings={contestants}
                  quizState={currentQuizState}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.nextQuestion}
                  onClick={returnToQuizSetup}
                >
                  Return to Quiz Setup
                </Button>
              </div>
            )}
          </>
        )}
      </Box>
    </div>
  );
}
