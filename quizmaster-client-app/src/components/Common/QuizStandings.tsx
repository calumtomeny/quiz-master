import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Contestant from "./Contestant";
import QuizState from "./QuizState";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 100,
  },
  tableheader: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
  },
  emojiCell: {
    paddingLeft: 0,
  },
  tableheaderCell: {
    color: "#ffffff",
  },
  tableheaderRankCell: {
    color: "#ffffff",
    paddingRight: 0,
  },
  ownRank: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
    paddingRight: 0,
  },
  otherRank: {
    color: "#000000",
    paddingRight: 0,
  },
  ownName: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  otherName: {
    color: "#000000",
  },
  ownScore: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  otherScore: {
    color: "#000000",
    fontWeight: "bold",
  },
}));

export default function QuizStandings(props: {
  contestantStandings: Contestant[];
  quizState: QuizState;
}) {
  const classes = useStyles();
  const [participantId, setParticipantId] = useState<string>("");
  const [rankings, setRankings] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setParticipantId(localStorage.getItem("participantId") || "");

    const newRankings: { [key: string]: number } = {};
    let currentRank = 0;
    let currentScore = -999999;
    let currentRankCount = 0;
    props.contestantStandings
      .sort((a, b) => b.score - a.score)
      .forEach((contestant) => {
        if (contestant.score == currentScore) {
          newRankings[contestant.id] = currentRank;
          currentRankCount += 1;
        } else {
          currentRank += currentRankCount + 1;
          currentScore = contestant.score;
          newRankings[contestant.id] = currentRank;
          currentRankCount = 0;
        }
      });
    setRankings(newRankings);
  }, [props.contestantStandings]);

  const getNameClass = (id: string) => {
    return id == participantId ? classes.ownName : classes.otherName;
  };

  const getRankClass = (id: string) => {
    return id == participantId ? classes.ownRank : classes.otherRank;
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.tableheader}>
            <TableCell size="small" className={classes.tableheaderRankCell}>
              Rank
            </TableCell>
            <TableCell className={classes.emojiCell}></TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Name
            </TableCell>
            <TableCell className={classes.tableheaderCell} align="center">
              Score (Speed Bonus)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contestantStandings
            .sort((a, b) => b.score - a.score)
            .map((contestantStanding) => (
              <TableRow key={contestantStanding.name}>
                <TableCell
                  size="small"
                  component="th"
                  scope="row"
                  className={getRankClass(contestantStanding.id)}
                >
                  {rankings[contestantStanding.id]}
                </TableCell>
                <TableCell align="center" className={classes.emojiCell}>
                  {rankings[contestantStanding.id] == 1 &&
                  props.quizState == QuizState.QuizEnded
                    ? "👑"
                    : ""}
                </TableCell>
                <TableCell
                  align="center"
                  className={getNameClass(contestantStanding.id)}
                >
                  {contestantStanding.name}
                </TableCell>
                <TableCell
                  align="center"
                  className={getNameClass(contestantStanding.id)}
                >
                  {contestantStanding.score} ({contestantStanding.bonusPoints})
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
