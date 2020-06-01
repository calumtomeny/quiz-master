import { makeStyles } from "@material-ui/core";
import React, { useReducer, useRef, useEffect } from "react";
import Axios from "axios";
import QuizQuestion from "../../Common/QuizQuestion";
import MaterialTable, { Column } from "material-table";
import Row from "./Row";
import reducer from "./QuestionReducer";

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
  const [state, dispatch] = useReducer(reducer, {
    columns: [
      { title: "Question", field: "question" },
      { title: "Answer", field: "answer" },
    ],
    data: [],
  });

  const isFirstRun = useRef(true);
  const doneInitialGet = useRef(false);

  useEffect(() => {
    Axios.get(`/api/quizzes/${props.quizId}/questions`).then((results) => {
      dispatch({ type: "set", payload: [...results.data] });
      doneInitialGet.current = true;
    });
  }, []);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet.current) {
      Axios.post(
        `/api/quizzes/${props.quizId}/questions`,
        state.data.map(
          (x: any) => new QuizQuestion(x.question, x.answer, x.number)
        )
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
              dispatch({ type: "add", payload: newData });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                dispatch({ type: "update", payload: newData });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              dispatch({ type: "delete", payload: oldData });
            }, 600);
          }),
      }}
    />
  );
}
