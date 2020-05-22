import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContestantList from "./ContestantList";
import "./HostLobby.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Contestant from "./Contestant";
import QuizMasterMessage from "../Common/QuizMasterMessage";
import Button from "@material-ui/core/Button";
import ContestantScore from "./ContestantScore";
import QuizQuestion from "../Common/QuizQuestion";
import QuizInitiator from "./QuizInitiator";
import { Box, Paper } from "@material-ui/core";
import QuizMarker from "./QuizQuestionDisplay";
import QuizQuestionDisplay from "./QuizQuestionDisplay";
import QuestionMarker from "./QuestionMarker";
import Data from "./QuestionResponse";
import ParticipantMessage from "../Common/ParticipantMessage";
import QuizStandings from "./QuizStandings";

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

export default function QuizHoster(props: any) {
  let { id } = useParams();
  const classes = useStyles();
  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [timeLeftAsAPercentage, setTimeLeftAsAPercentage] = useState(0);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showQuizMarker, setShowQuizMarker] = useState(true);
  const [quizIsComplete, setQuizIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Data[]>([])
  const [contestantScores, setContestantScores] = useState<ContestantScore[]>(
    []
  );

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);

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
      .post(
        `http://localhost:5000/api/quizzes/${id}/command/quizmastermessage`,
        message
      )
      .then((x) => {
        setCurrentQuestionNumber((currentNumber) => currentNumber + 1);
      });
    setTimeLeftAsAPercentage(100);
  };

  const onQuizInitiate = () => {
    messageContestants();
  };

  const getCurrentQuizQuestion = () => {
    let question = quizQuestions.find(
      (x) => x.QuestionNumber == currentQuestionNumber
    );
    return question;
  };

  const getQuizQuestion = (questionNumber: number) => {
    let question = quizQuestions.find(
      (x) => x.QuestionNumber == questionNumber
    );
    return question;
  };

  const isFinalQuestion = () => currentQuestionNumber == quizQuestions.length;

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
        .post(
          `http://localhost:5000/api/quizzes/${id}/command/quizmastermessage`,
          message
        )
        .then((x) => {
          setQuizIsComplete(true);
        });
    } else {
      setShowQuizMarker(true);
      setAnswers([])
      messageContestants();
    }
  };

  const onAcceptAnswers = (
    contestantsWithCorrectAnswerToCurrentQuestion: string[]
  ) => {
    setContestants((contestants) =>
      contestants.map((contestant) => {
        return {
          ...contestant,
          score: contestantsWithCorrectAnswerToCurrentQuestion.includes(
            contestant.id
          )
            ? contestant.score + 1
            : contestant.score,
        };
      })
    );
    setShowQuizMarker(false);
  };

  function createData(answer: string, name: string, id: string): Data {
    return { answer, name, id };
  }

  useEffect(() => {
    function progress() {
      setTimeLeftAsAPercentage((oldCompleted) => {
        return Math.max(oldCompleted - 10, 0);
      });
    }
    const timer = setInterval(progress, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeftAsAPercentage]);

  useEffect(() => {
    let contestantsList: Contestant[] = [];
    axios.get(`http://localhost:5000/api/quizzes/${id}`).then((res) => {
      setQuizName(res.data.name);
      setQuizId(res.data.id);
      setQuizCode(res.data.code);

      axios
        .get(`http://localhost:5000/api/quizzes/${id}/questions`)
        .then((results) => {
          const message: QuizMasterMessage = {
            start: true,
            question: "",
            answer: "",
            complete: false,
            questionNumber: 1,
          };

          axios
            .post(
              `http://localhost:5000/api/quizzes/${id}/command/quizmastermessage`,
              message
            )
            .then(() => {
              debugger;
              axios
                .get(`http://localhost:5000/api/quizzes/${id}/contestants`)
                .then((res) => {
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

          setQuizQuestions((x) =>
            results.data.map(
              (x: any) => new QuizQuestion(x.question, x.answer, x.number)
            )
          );
        });
    });

    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl("http://localhost:5000/quiz")
        .build();

      try {
        await hubConnect
          .start()
          .then(() => console.log(hubConnect.state))
          .then(() => {
            debugger;
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
                (x) => x.id === message.participantId
              )[0].name,
            },
          ]);
        });
      } catch (err) {
        alert(err);
      }
    };
    createHubConnection();
  }, []);

  return (
    <div className={classes.root}>
      <Box mt={2}>
        <Typography component="h1" variant="h4">
          {quizName}
        </Typography>
      </Box>
      <Box pt={3} pb={3}>
        {currentQuestionNumber == 0 ? (
          <QuizInitiator quizName={quizName} clickHandler={onQuizInitiate} />
        ) : (
          <>
            {!quizIsComplete ? (
              <QuizQuestionDisplay
                quizQuestion={getCurrentQuizQuestion()}
                timeLeftAsAPercentage={timeLeftAsAPercentage}
              />
            ) : (
              <></>
            )}
            <Typography component="h1" variant="h5">
              Answer: {getCurrentQuizQuestion()?.Answer}
            </Typography>
            {!quizIsComplete ? <>
            <Paper className={classes.paper}>
              {showQuizMarker ? (
                <QuestionMarker
                  rows={answers}
                  answer={getCurrentQuizQuestion()?.Answer ?? ""}
                  onAcceptAnswers={onAcceptAnswers}
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
            </Typography></> : <></>}
            <QuizStandings contestantStandings={contestants} />
          </>
        )}
      </Box>
    </div>
  );
}
