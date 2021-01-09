import React, { useReducer, useRef, useEffect, useState } from "react";
import Axios from "axios";
import QuizQuestion from "../../Common/QuizQuestion";
import MaterialTable from "material-table";
import { Box, TextField } from "@material-ui/core";
import reducer from "./QuestionReducer";
import QuestionInitialiser from "./QuestionInitialiser";
import TableFieldEditor from "./TableFieldEditor";

export default function QuestionCreator(props: any) {
  const [editFieldError, setEditFieldError] = useState({
    error: false,
    label: "",
    helperText: "",
  });

  const [state, dispatch] = useReducer(reducer, {
    columns: [
      {
        field: "number",
        width: 50,
        editable: "never",
      },
      {
        title: "Question",
        field: "question",
        // eslint-disable-next-line react/display-name
        editComponent: (props: any) => (
          <TextField
            error={editFieldError.error}
            helperText={editFieldError.helperText}
            value={props.value ? props.value : editFieldError.helperText}
            fullWidth
            multiline
            onChange={(e) => props.onChange(e.target.value)}
            autoFocus={props.columnDef.tableData.columnOrder === 0}
          />
        ),
      },
      {
        title: "Answer",
        field: "answer",
        editComponent: TableFieldEditor,
      },
    ],
    data: [],
  });

  const [doneInitialGet, setDoneInitialGet] = useState<boolean>(false);
  const isFirstRun = useRef(true);
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);

  const setInitialQuestion = (question: string, answer: string) => {
    dispatch({ type: "add", payload: { question: question, answer: answer } });
  };

  useEffect(() => {
    props.onQuestionsUpdated(state.data.length);
  }, [state]);

  useEffect(() => {
    Axios.get(`/api/quizzes/${props.quizId}/questions`).then((results) => {
      dispatch({ type: "set", payload: results.data });
      setDoneInitialGet(true);
      setIsInitialQuestion(results.data.length == 0);
    });
  }, [props.quizId]);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet && state.data.length) {
      Axios.post(
        `/api/quizzes/${props.quizId}/questions`,
        state.data.map(
          (x: any) => new QuizQuestion(x.question, x.answer, x.number),
        ),
      );
    }
    isFirstRun.current = false;
  }, [state, doneInitialGet, props.quizId]);

  return (
    <>
      <QuestionInitialiser
        onInitialQuestionSubmitted={setInitialQuestion}
        isInitialQuestion={isInitialQuestion}
      />
      <span>Helper: {editFieldError.helperText}</span>
      <button onClick={() => console.log(editFieldError)}></button>
      <Box pt={3} pb={3}>
        {state.data.length || !doneInitialGet ? (
          <MaterialTable
            options={{
              actionsColumnIndex: -1,
              draggable: false,
              filtering: false,
              paging: false,
              search: false,
              toolbar: false,
              padding: "dense",
              rowStyle: {
                wordBreak: "break-all",
              },
            }}
            localization={{
              header: {
                actions: "",
              },
            }}
            title=""
            columns={state.columns}
            data={state.data}
            editable={{
              onRowUpdate: (newData: any, oldData: any) =>
                new Promise<void>((resolve, reject) => {
                  setTimeout(() => {
                    if (newData.question === "") {
                      setEditFieldError({
                        error: true,
                        label: "required",
                        helperText: "Required helper text",
                      });
                      reject();
                      return;
                    }
                    resolve();
                    if (oldData) {
                      dispatch({ type: "update", payload: newData });
                    }
                  }, 600);
                }),
              onRowDelete: (oldData) =>
                new Promise<void>((resolve) => {
                  setTimeout(() => {
                    resolve();
                    dispatch({ type: "delete", payload: oldData });
                  }, 600);
                }),
            }}
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
