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
import { Box } from "@material-ui/core";
import QuizMarker from "./QuizQuestionDisplay";
import QuizQuestionDisplay from "./QuizQuestionDisplay";
import QuestionMarker from "./QuestionMarker";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function QuizHoster(props: any) {
  let { id } = useParams();
  const classes = useStyles();
  const [quizCode, setQuizCode] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [contestantScores, setContestantScores] = useState<ContestantScore[]>(
    []
  );
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    props.QuizQuestions
  );

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);

  const onQuizInitiate = () => {
    const message: QuizMasterMessage = {
      start: false,
      question: getQuizQuestion(currentQuestionNumber + 1)?.Question ?? "",
      answer: getQuizQuestion(currentQuestionNumber + 1)?.Answer ?? "",
      complete: false,
      questionNumber: getQuizQuestion(currentQuestionNumber + 1)?.QuestionNumber ?? 1,
    };
    
    axios.post(
      `http://localhost:5000/api/quizzes/${id}/command/message`,
      message
    ).then(x => {
      setCurrentQuestionNumber(1);
    });
  };

  const getCurrentQuizQuestion = () => {
    let question = quizQuestions.find((x) => x.QuestionNumber == currentQuestionNumber);
    debugger;
    return question;
  };

  const getQuizQuestion = (questionNumber: number) => {
    let question = quizQuestions.find((x) => x.QuestionNumber == questionNumber);
    return question;
  };

  useEffect(() => {
    let isCancelled = false;

    axios.get(`http://localhost:5000/api/quizzes/${id}`).then((res) => {
      setQuizName(res.data.name);
      setQuizId(res.data.id);
      setQuizCode(res.data.code);
      debugger;

      axios
        .get(`http://localhost:5000/api/quizzes/${id}/questions`)
        .then((results) => {
          const message: QuizMasterMessage = {
            start: true,
            question: "",
            answer: "",
            complete: false,
            questionNumber: 1
          };
          
          axios.post(
            `http://localhost:5000/api/quizzes/${id}/command/message`,
            message
          );

          setQuizQuestions((x) =>
            results.data.map(
              (x: any) => new QuizQuestion(x.question, x.answer, x.number)
            )
          );
        });
    });

    // const createHubConnection = async () => {
    //   // Build new Hub Connection, url is currently hard coded.
    //   const hubConnect = new HubConnectionBuilder()
    //     .withAutomaticReconnect()
    //     .withUrl("http://localhost:5000/quiz")
    //     .build();

    //   try {
    //     await hubConnect
    //       .start()
    //       .then(() => console.log(hubConnect.state))
    //       .then(() => {
    //         debugger;
    //         console.log("Joining group...");
    //         hubConnect.invoke("AddToGroup", id);
    //         console.log("Connection successful!");
    //       })
    //       .catch(() => {
    //         console.log("Error adding to quiz group.");
    //       });

    //     hubConnect.on("ContestantUpdate", (contestant: Contestant) => {
    //       setContestants((c) => [...c, contestant.name]);
    //     });
    //   } catch (err) {
    //     alert(err);
    //   }
    // };
    return () => {
      isCancelled = true;
    };
    // createHubConnection();
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
          <QuizQuestionDisplay quizQuestion={getCurrentQuizQuestion()} />
          <QuestionMarker/>
          </>
        )}
      </Box>
    </div>
  );
}
