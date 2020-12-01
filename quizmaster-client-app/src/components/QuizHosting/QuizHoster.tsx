import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
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
import ContestantScore from "./ContestantScore";

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
}));

export default function QuizHoster() {
  const { id } = useParams();
  const classes = useStyles();
  const [quizName, setQuizName] = useState("");
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState(0);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [showQuizMarker, setShowQuizMarker] = useState(true);
  const [quizIsComplete, setQuizIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Data[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [totalTimeInSeconds, setTotalTimeInSeconds]  = useState(0);
  const [questionStartTime, setQuestionStartTime]  = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);

  const getQuizQuestion = (questionNumber: number) => {
    const question = quizQuestions.find(
      (x) => x.QuestionNumber === questionNumber,
    );
    return question;
  };

  const messageContestants = () => {
    const message: QuizMasterMessage = {
      start: false,
      question: getQuizQuestion(currentQuestionNumber + 1)?.Question ?? "",
      answer: getQuizQuestion(currentQuestionNumber + 1)?.Answer ?? "",
      complete: false,
      questionNumber:
        getQuizQuestion(currentQuestionNumber + 1)?.QuestionNumber ?? 1,
    };

    axios
      .post(`/api/quizzes/${id}/command/quizmastermessage`, message)
      .then(() => {
        setCurrentQuestionNumber((currentNumber) => currentNumber + 1);
      });
    setTotalTimeInSeconds(120);
    setQuestionStartTime(Date.now());
    setAnswersSubmitted(false);
    setTimeLeftAsAPercentage(100);
  };

  const onQuizInitiate = () => {
    messageContestants();
  };

  const getCurrentQuizQuestion = () => {
    const question = quizQuestions.find(
      (x) => x.QuestionNumber === currentQuestionNumber,
    );
    return question;
  };

  const roundIsComplete = () =>
    timeLeftAsAPercentage === 0 || answers.length === contestants.length;

  const isFinalQuestion = () => currentQuestionNumber === quizQuestions.length;

  const onGoToNextQuestion = () => {
    if (isFinalQuestion()) {
      const message: QuizMasterMessage = {
        start: false,
        question: "",
        answer: "",
        complete: true,
        questionNumber: 0,
      };

      axios
        .post(`/api/quizzes/${id}/command/quizmastermessage`, message)
        .then(() => {
          setQuizIsComplete(true);
        });
    } else {
      setShowQuizMarker(true);
      setAnswers([]);
      messageContestants();
    }
  };

  function getContestantScoreForRound(scores: ContestantScore[],contestantId: String): number {
    return scores.find(x => x.ContestantId == contestantId)?.Score ?? 0;
  }
  
  const onAcceptAnswers = (
    correctResponses: QuestionResponse[],
  ) => {

    setAnswersSubmitted(true);

    //Loop through responses to determine fastest answer
    let fastestContestant:String = "";
    let fastestContestantTimeLeft:number = 0;
    correctResponses.forEach(response => {
      if(response.answerTimeLeftAsAPercentage > fastestContestantTimeLeft){
        fastestContestantTimeLeft = response.answerTimeLeftAsAPercentage;
        fastestContestant = response.id;
      }     
    });
    
    //Loop through responses to build scores
    let roundScores:ContestantScore[] = [];
    correctResponses.forEach(response => {
      let score = 1;
      if(response.id == fastestContestant){
        score = 2;
      }     
      const contestantScore: ContestantScore = {
        ContestantId: response.id,
        ContestantName: response.name,
        Score: score
      }
      roundScores.push(contestantScore);
    });
    
    setContestants((contestants) =>
      contestants.map((contestant) => {
        return {
          ...contestant,
          score: contestant.score + getContestantScoreForRound(roundScores,contestant.id)
        };
      }),
    );
    setShowQuizMarker(false);
  };

  useEffect(() => {
    const interval = 100;
 
    function progress() {
      if(!answersSubmitted){
        setTimeLeftAsAPercentage((oldCompleted) => {
          let increment = 100*(Date.now() - questionStartTime)/(totalTimeInSeconds*1000)
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
    let contestantsList: Contestant[] = [];
    axios.get(`/api/quizzes/${id}`).then((res) => {
      setQuizName(res.data.name);

      axios.get(`/api/quizzes/${id}/questions`).then((results) => {
        const message: QuizMasterMessage = {
          start: true,
          question: "",
          answer: "",
          complete: false,
          questionNumber: 1,
        };

        axios
          .post(`/api/quizzes/${id}/command/quizmastermessage`, message)
          .then(() => {
            axios.get(`/api/quizzes/${id}/contestants`).then((res) => {
              contestantsList = res.data.map((contestant: any) => {
                return {
                  name: contestant.name,
                  id: contestant.id,
                  score: 0,
                } as Contestant;
              });
              setContestants(contestantsList);
            });
          });

        setQuizQuestions(() =>
          results.data.map(
            (x: any) => new QuizQuestion(x.question, x.answer, x.number),
          ),
        );
      });
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

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          {quizName}
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        {currentQuestionNumber === 0 ? (
          <QuizInitiator quizName={quizName} clickHandler={onQuizInitiate} />
        ) : (
          <>
            {!quizIsComplete ? (
              <QuizQuestionDisplay
                quizQuestion={getCurrentQuizQuestion()}
                timeLeftAsAPercentage={timeLeftAsAPercentage}
                totalTimeInSeconds={totalTimeInSeconds}
              />
            ) : (
              <></>
            )}
            <Typography component="h1" variant="h5">
              Answer: {getCurrentQuizQuestion()?.Answer}
            </Typography>
            {!quizIsComplete ? (
              <>
                <Paper className={classes.paper}>
                  {showQuizMarker ? (
                    <QuestionMarker
                      rows={answers}
                      answer={getCurrentQuizQuestion()?.Answer ?? ""}
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
                      {isFinalQuestion()
                        ? "Show final standings"
                        : "Go to next question"}
                    </Button>
                  )}
                </Paper>
                <Typography component="h1" variant="h5">
                  {quizIsComplete ? "Final Standings" : "Quiz Standings"}
                </Typography>
              </>
            ) : (
              <></>
            )}
            <QuizStandings contestantStandings={contestants} />
          </>
        )}
      </Box>
    </div>
  );
}
