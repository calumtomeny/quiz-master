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
import QuestionSummary from "./HostQuestionSummary";
import ContestantsSummary from "./ContestansSummary";

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
  contestantName: {
    paddingRight: 0,
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
  emojiCell: {
    paddingLeft: 0,
  },
}));

export default function HostFinalSummary(props: { id: string }) {
  const classes = useStyles();

  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>(
    [],
  );

  const getAnswerClass = (correct: boolean) => {
    return correct ? classes.answerIsCorrect : classes.answerIsIncorrect;
  };

  useEffect(() => {
    axios
      .get(`/api/quizzes/${props.id}/finalsummary`)
      .then((res) => {
        setQuestionSummaries(res.data);
      })
      .catch((err) => console.log(err));
  }, [props.id]);

  return (
    <TableContainer component={Paper}>
      {questionSummaries
        .sort((a, b) => a.number - b.number)
        .map((question: QuestionSummary) => (
          <Table
            size="small"
            className={classes.questionTable}
            aria-label={`question table ${question.number}`}
            key={question.number}
          >
            <TableHead>
              <TableRow className={classes.tableheader}>
                <TableCell
                  align="left"
                  className={classes.tableheaderCell}
                  size="small"
                >
                  {`Question ${question.number}: ${question.question}`}
                </TableCell>
                <TableCell align="center" className={classes.tableheaderCell}>
                  {`Answer: ${question.answer}`}
                </TableCell>
                <TableCell align="center" className={classes.tableheaderCell}>
                  Fastest
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {question.contestants.map(
                (contestant: ContestantsSummary, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.contestantName}
                    >
                      {contestant.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={getAnswerClass(contestant.answeredCorrectly)}
                    >
                      {contestant.answer}
                    </TableCell>
                    <TableCell align="center">
                      {contestant.answeredCorrectlyFastest ? "🚀" : ""}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        ))}
    </TableContainer>
  );
}
