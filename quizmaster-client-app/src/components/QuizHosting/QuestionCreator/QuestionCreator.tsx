import React, { useReducer, useRef, useEffect } from "react";
import Axios from "axios";
import QuizQuestion from "../../Common/QuizQuestion";
import MaterialTable from "material-table";
import reducer from "./QuestionReducer";


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
      dispatch({ type: "set", payload: results.data });
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
      );
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
