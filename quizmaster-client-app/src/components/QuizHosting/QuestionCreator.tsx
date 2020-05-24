import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable, { Column } from "material-table";
import Axios from "axios";
import QuizQuestion from "../Common/QuizQuestion";

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

  const [state, setState] = useState<TableState>({
    columns: [
      { title: "Question", field: "question" },
      { title: "Answer", field: "answer" },
    ],
    data: [],
  });

  const isFirstRun = useRef(true);
  const doneInitialGet = useRef(false);

  useEffect(() => {
    Axios.get(
      `/api/quizzes/${props.quizId}/questions`
    ).then((results) => {
      setState((prevState) => {
        const data: Row[] = [...results.data];
        return { ...prevState, data };
      });
      doneInitialGet.current = true;
    });
  }, []);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet.current) {
      Axios.post(
        `/api/quizzes/${props.quizId}/questions`,
        state.data.map((x) => new QuizQuestion(x.question, x.answer, x.number))
      ).then(() => {});
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
