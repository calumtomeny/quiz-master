import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import QuestionSummary from "./QuestionSummary";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 100,
  },
  questionTable: {
    minWidth: 100,
    marginBottom: 10,
  },
  tableheader: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
  },
  tableheaderCell: {
    color: "#ffffff",
  },
  answerIsCorrect: {
    color: "green",
    fontWeight: "bold",
  },
  answerIsIncorrect: {
    color: "red",
    fontWeight: "bold",
  },
  answerIsFastest: {
    color: "green",
    fontWeight: "bold",
  },
  answerIsNotFastest: {
    color: "#000000",
  },
}));

export default function FinalSummary(props: { participantId: string }) {
  const classes = useStyles();
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>(
    [],
  );

  useEffect(() => {
    axios
      .get(`/api/contestants/${props.participantId}/finalsummary`)
      .then((res) => {
        setQuestionSummaries(res.data);
      });
  }, [props.participantId]);

  const getAnswerClass = (score: number) => {
    if (score > 0) {
      return classes.answerIsCorrect;
    } else {
      return classes.answerIsIncorrect;
    }
  };

  const getFastestClass = (fastest: boolean) => {
    if (fastest) {
      return classes.answerIsFastest;
    } else {
      return classes.answerIsNotFastest;
    }
  };

  return (
    <TableContainer component={Paper}>
      {questionSummaries
        .sort((a, b) => a.number - b.number)
        .map((question: QuestionSummary) => (
          <Table
            size="small"
            className={classes.questionTable}
            aria-label={"question table " + question.number}
            key={question.number}
          >
            <TableHead>
              <TableRow className={classes.tableheader}>
                <TableCell
                  align="center"
                  colSpan={2}
                  className={classes.tableheaderCell}
                >
                  {"Question " + question.number + ": " + question.question}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Correct Answer
                </TableCell>
                <TableCell align="center">{question.correctAnswer}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Your Answer
                </TableCell>
                <TableCell
                  align="center"
                  className={getAnswerClass(question.score)}
                >
                  {question.contestantAnswer}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Fastest Answer
                </TableCell>
                <TableCell
                  align="center"
                  className={getFastestClass(question.contestantIsFastest)}
                >
                  {question.fastestContestantName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Score
                </TableCell>
                <TableCell align="center">{question.score}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))}
    </TableContainer>
  );
}
