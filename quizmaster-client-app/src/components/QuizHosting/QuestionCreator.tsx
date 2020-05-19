import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IIndexable from "../Common/Indexable";
import Typography from "@material-ui/core/Typography/Typography";
import { TextField, Button } from "@material-ui/core";
import MaterialTable, { Column } from "material-table";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import Axios from "axios";
import QuizQuestion from "./QuizQuestion";

interface Row {
  number: number;
  question: string;
  answer: string;
}

interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function QuestionCreator(props: any) {
  const classes = useStyles();

  const [state, setState] = useState<TableState>({
    columns: [
      { title: "Question", field: "question" },
      { title: "Answer", field: "answer" },
    ],
    data: [
      {
        number: 1,
        question: "What is the capital of France?",
        answer: "Paris",
      },
      {
        number: 2,
        question: "What is the capital of England?",
        answer: "London",
      },
    ],
  });

  const isFirstRun = useRef(true);
  const doneInitialGet = useRef(false);

  useEffect(() => {
    console.log("Do get.");
    Axios.get(
      `http://localhost:5000/api/quizzes/${props.quizId}/questions`
    ).then((results) => {
      debugger;
      setState((prevState) => {
        const data: Row[] = [...results.data];
        return { ...prevState, data };
      });
      doneInitialGet.current = true;
      console.log("Done get.");
    });
  }, []);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet.current) {
      console.log("Do post.");
      Axios.post(
        `http://localhost:5000/api/quizzes/${props.quizId}/questions`,
        state.data.map((x) => new QuizQuestion(x.question, x.answer, x.number))
      ).then((res: any) => {
        console.log("Done post.");
        console.log(res.status);
      });
    }
    isFirstRun.current = false;
  }, [state]);

  return (
    <MaterialTable
      title="Questions"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}
