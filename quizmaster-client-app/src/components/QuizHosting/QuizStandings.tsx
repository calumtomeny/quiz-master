import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Contestant from "./Contestant";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function QuizStandings(props: {
  contestantStandings: Contestant[];
}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contestantStandings
            .sort((a, b) => b.score - a.score)
            .map((contestantStanding) => (
              <TableRow key={contestantStanding.name}>
                <TableCell component="th" scope="row">
                  {contestantStanding.name}
                </TableCell>
                <TableCell align="center">{contestantStanding.score}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
