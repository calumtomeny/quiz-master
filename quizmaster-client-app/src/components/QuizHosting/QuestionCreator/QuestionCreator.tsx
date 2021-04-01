import React, { useReducer, useRef, useEffect, useState } from "react";
import Axios from "axios";
import QuizQuestion from "../../Common/QuizQuestion";
import MaterialTable from "material-table";
import { Box, TextField } from "@material-ui/core";
import reducer from "./QuestionReducer";
import QuestionInitialiser from "./QuestionInitialiser";

export default function QuestionCreator(props: any) {
  const [editFieldError, setEditFieldError] = useState({
    error: false,
    label: "",
    helperText: "",
    validateInput: false,
  });

  const columns = [
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
          error={
            !props.value.trim() && editFieldError.validateInput
              ? editFieldError.error
              : false
          }
          label={
            !props.value.trim() && editFieldError.validateInput
              ? editFieldError.helperText
              : ""
          }
          value={props.value ? props.value : ""}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          onChange={(e) => props.onChange(e.target.value)}
          autoFocus={props.columnDef.tableData.columnOrder === 0}
        />
      ),
    },
    {
      title: "Answer",
      field: "answer",
      // eslint-disable-next-line react/display-name
      editComponent: (props: any) => (
        <TextField
          error={
            !props.value.trim() && editFieldError.validateInput
              ? editFieldError.error
              : false
          }
          label={
            !props.value.trim() && editFieldError.validateInput
              ? editFieldError.helperText
              : ""
          }
          value={props.value ? props.value : ""}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
  ];

  const [columnsState, setColumnsState] = useState<any>(columns);
  const [dataState, dispatch] = useReducer(reducer, {
    data: [],
  });
  const [doneInitialGet, setDoneInitialGet] = useState<boolean>(false);
  const isFirstRun = useRef(true);
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);
  const [questionsLoadingInProgress, setQuestionsLoadingInProgress] = useState(
    false,
  );

  const setQuestion = (question: string, answer: string) => {
    dispatch({ type: "add", payload: { question: question, answer: answer } });
    setEditFieldError({
      error: true,
      label: "required",
      helperText: "Required",
      validateInput: true,
    });
  };

  const createTenQuestions = () => {
    setQuestionsLoadingInProgress(true);
    Axios.get(`/api/quizzes/${props.quizId}/generatequestions`).then(
      (results) => {
        dispatch({ type: "set", payload: results.data });
        setQuestionsLoadingInProgress(false);
        setDoneInitialGet(true);
        setIsInitialQuestion(false);
      },
    );
  };

  useEffect(() => {
    props.onQuestionsUpdated(dataState.data.length);
  }, [dataState, props]);

  useEffect(() => {
    Axios.get(`/api/quizzes/${props.quizId}/questions`).then((results) => {
      dispatch({ type: "set", payload: results.data });
      setDoneInitialGet(true);
      setIsInitialQuestion(results.data.length === 0);
    });
  }, [props.quizId]);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet && dataState.data.length) {
      Axios.post(
        `/api/quizzes/${props.quizId}/questions`,
        dataState.data.map(
          (x: any) => new QuizQuestion(x.question, x.answer, x.number),
        ),
      );
    }
    isFirstRun.current = false;
  }, [dataState, doneInitialGet, props.quizId]);

  useEffect(() => {
    setColumnsState(columns);
  }, [editFieldError, dataState]);

  return (
    <>
      <QuestionInitialiser
        onQuestionSubmitted={setQuestion}
        onCreateTenQuestions={createTenQuestions}
        isInitialQuestion={isInitialQuestion}
        questionsLoadingInProgress={questionsLoadingInProgress}
      />
      <Box pt={3} pb={3}>
        {dataState.data.length || !doneInitialGet ? (
          <MaterialTable
            options={{
              actionsColumnIndex: -1,
              draggable: false,
              filtering: false,
              paging: false,
              search: false,
              toolbar: false,
              sorting: false,
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
            columns={columnsState}
            data={dataState.data}
            editable={{
              onRowUpdate: (newData: any, oldData: any) =>
                new Promise<void>((resolve, reject) => {
                  setTimeout(() => {
                    const question = newData.question.trim();
                    const answer = newData.answer.trim();
                    if (question === "" || answer === "") {
                      setColumnsState([]);
                      setEditFieldError({
                        error: true,
                        label: "required",
                        helperText: "Required",
                        validateInput: true,
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
