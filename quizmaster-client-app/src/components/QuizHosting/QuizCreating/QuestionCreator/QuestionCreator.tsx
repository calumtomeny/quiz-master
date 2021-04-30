import React, { useReducer, useRef, useEffect, useState } from "react";
import Axios from "axios";
import QuizQuestion from "../../../Common/QuizQuestion";
// import MaterialTable from "material-table";
import {
  Box,
  TableCell,
  // TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  IconButton,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import reducer from "./QuestionReducer";
import QuestionInitialiser from "./QuestionInitialiser";
import Row from "./Row";

export default function QuestionCreator(props: any) {
  // const [editFieldError, setEditFieldError] = useState({
  //   error: false,
  //   label: "",
  //   helperText: "",
  //   validateInput: false,
  // });

  // const columns = [
  //   {
  //     field: "number",
  //     width: 50,
  //     editable: "never",
  //   },
  //   {
  //     title: "Question",
  //     field: "question",
  //     // eslint-disable-next-line react/display-name
  //     editComponent: (props: any) => (
  //       <TextField
  //         error={
  //           !props.value.trim() && editFieldError.validateInput
  //             ? editFieldError.error
  //             : false
  //         }
  //         label={
  //           !props.value.trim() && editFieldError.validateInput
  //             ? editFieldError.helperText
  //             : ""
  //         }
  //         value={props.value ? props.value : ""}
  //         fullWidth
  //         multiline
  //         variant="outlined"
  //         size="small"
  //         onChange={(e) => props.onChange(e.target.value)}
  //         autoFocus={props.columnDef.tableData.columnOrder === 0}
  //       />
  //     ),
  //   },
  //   {
  //     title: "Answer",
  //     field: "answer",
  //     // eslint-disable-next-line react/display-name
  //     editComponent: (props: any) => (
  //       <TextField
  //         error={
  //           !props.value.trim() && editFieldError.validateInput
  //             ? editFieldError.error
  //             : false
  //         }
  //         label={
  //           !props.value.trim() && editFieldError.validateInput
  //             ? editFieldError.helperText
  //             : ""
  //         }
  //         value={props.value ? props.value : ""}
  //         fullWidth
  //         multiline
  //         variant="outlined"
  //         size="small"
  //         onChange={(e) => props.onChange(e.target.value)}
  //       />
  //     ),
  //   },
  // ];

  // const [columnsState, setColumnsState] = useState<any>(columns);
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
    // setEditFieldError({
    //   error: true,
    //   label: "required",
    //   helperText: "Required",
    //   validateInput: true,
    // });
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

  const onDragEnd = (res: any) => {
    const { destination, source } = res;
    // if dropped outside table:
    if (!destination) return;
    // if dropped back in same position:
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const newData = Array.from(dataState.data);

    const changeItemPosition = (arr: Array<any>, from: number, to: number) => {
      const el = arr[from];
      arr.splice(from, 1);
      arr.splice(to, 0, el);
    };

    changeItemPosition(newData, source.index, destination.index);
    dispatch({ type: "dragAndDrop", payload: newData });
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

  // useEffect(() => {
  //   setColumnsState(columns);
  // }, [editFieldError, dataState]);

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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{/* Number */}</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>{/* Icons */}</TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {dataState.data.map((row: Row, index: number) => (
                        <Draggable
                          key={row.number}
                          draggableId={row.number.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <TableRow
                              key={row.number}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              innerRef={provided.innerRef}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell>{row.question}</TableCell>
                              <TableCell>{row.answer}</TableCell>
                              <TableCell>
                                <IconButton>
                                  <Edit />
                                </IconButton>
                                <IconButton aria-label="delete">
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        ) : (
          // <MaterialTable
          //   options={{
          //     actionsColumnIndex: -1,
          //     draggable: false,
          //     filtering: false,
          //     paging: false,
          //     search: false,
          //     toolbar: false,
          //     sorting: false,
          //     rowStyle: {
          //       wordBreak: "break-all",
          //     },
          //   }}
          //   localization={{
          //     header: {
          //       actions: "",
          //     },
          //   }}
          //   title=""
          //   columns={columnsState}
          //   data={dataState.data}
          //   editable={{
          //     onRowUpdate: (newData: any, oldData: any) =>
          //       new Promise<void>((resolve, reject) => {
          //         setTimeout(() => {
          //           const question = newData.question.trim();
          //           const answer = newData.answer.trim();
          //           if (question === "" || answer === "") {
          //             setColumnsState([]);
          //             setEditFieldError({
          //               error: true,
          //               label: "required",
          //               helperText: "Required",
          //               validateInput: true,
          //             });
          //             reject();
          //             return;
          //           }
          //           resolve();
          //           if (oldData) {
          //             dispatch({ type: "update", payload: newData });
          //           }
          //         }, 600);
          //       }),
          //     onRowDelete: (oldData) =>
          //       new Promise<void>((resolve) => {
          //         setTimeout(() => {
          //           resolve();
          //           dispatch({ type: "delete", payload: oldData });
          //         }, 600);
          //       }),
          //   }}
          // />
          <></>
        )}
      </Box>
    </>
  );
}
