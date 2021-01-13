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
    color: "#000000",
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
      <Table size="small" className={classes.table} aria-label="summary table">
        <TableHead>
          <TableRow className={classes.tableheader}>
            <TableCell className={classes.tableheaderCell}>Number</TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Question
            </TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Correct Answer
            </TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Your Answer
            </TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Fastest Contestant
            </TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Score
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questionSummaries
            .sort((a, b) => a.number - b.number)
            .map((question: QuestionSummary) => (
              <TableRow key={question.number}>
                <TableCell component="th" scope="row">
                  {question.number}
                </TableCell>
                <TableCell align="center">{question.question}</TableCell>
                <TableCell align="center">{question.correctAnswer}</TableCell>
                <TableCell
                  align="center"
                  className={getAnswerClass(question.score)}
                >
                  {question.contestantAnswer}
                </TableCell>
                <TableCell
                  align="center"
                  className={getFastestClass(question.contestantIsFastest)}
                >
                  {question.fastestContestantName}
                </TableCell>
                <TableCell align="center">{question.score}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
