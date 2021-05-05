import React, {
  useReducer,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import Axios from "axios";
import QuizQuestion from "../../../Common/QuizQuestion";
// import MaterialTable from "material-table";
import {
  Box,
  TableCell,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  IconButton,
} from "@material-ui/core";
import { Edit, Delete, Check } from "@material-ui/icons";
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
  console.log("dataState: ", dataState);
  const [questionsAndAnswers, setQuesitonsAndAnswers] = useState<any>([]);
  console.log("q&as: ", questionsAndAnswers);
  const [editIndex, setEditIndex] = useState<number>(-1);
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
        setQuesitonsAndAnswers(results.data);
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
      setQuesitonsAndAnswers(results.data);
      setDoneInitialGet(true);
      setIsInitialQuestion(results.data.length === 0);
    });
  }, [props.quizId]);

  useEffect(() => {
    if (!isFirstRun.current && doneInitialGet && dataState.data.length) {
      Axios.post(
        `/api/quizzes/${props.quizId}/questions`,
        questionsAndAnswers.map(
          (x: any) => new QuizQuestion(x.question, x.answer, x.number),
        ),
      ).then((res) => setQuesitonsAndAnswers(res.data));
    }
    isFirstRun.current = false;
  }, [dataState, doneInitialGet, props.quizId]);

  // useEffect(() => {
  //   setColumnsState(columns);
  // }, [editFieldError, dataState]);

  const handleRemove = (i: number) =>
    dispatch({ type: "delete", payload: dataState.data[i] });

  const startEditing = (i: number) => setEditIndex(i);

  const stopEditing = (i: number) => {
    console.log(i);
    setEditIndex(-1);
    // dispatch({ type: "update", payload: questionsAndAnswers[i] });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    i: number,
  ) => {
    const { value } = e.currentTarget;
    if (name === "question") {
      dispatch({ type: "update", payload: questionsAndAnswers[i] });
      // setQuesitonsAndAnswers(
      //   questionsAndAnswers.map((row: any, j: number) =>
      //     j === i ? { ...row, question: value } : row,
      //   ),
      // );
    }
    if (name === "answer") {
      setQuesitonsAndAnswers(
        questionsAndAnswers.map((row: any, j: number) =>
          j === i ? { ...row, answer: value } : row,
        ),
      );
    }
  };

  const row = (
    x: Row,
    i: number,
    handleRemove: any,
    startEditing: any,
    stopEditing: any,
    handleChange: any,
  ) => {
    const currentlyEditing = editIndex === i;
    return (
      <Draggable key={x.number} draggableId={x.number.toString()} index={i}>
        {(provided) => (
          <TableRow
            key={x.number}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            innerRef={provided.innerRef}
          >
            <TableCell component="th" scope="row">
              {i + 1}
            </TableCell>
            <TableCell>
              {currentlyEditing ? (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Question"
                  onChange={(e) => handleChange(e, "question", i)}
                  value={x.question}
                />
              ) : (
                x.question
              )}
            </TableCell>
            <TableCell>
              {currentlyEditing ? (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Answer"
                  onChange={(e) =>
                    dispatch({
                      type: "onChange",
                      payload: e.currentTarget.value,
                    })
                  }
                  value={x.answer}
                />
              ) : (
                x.answer
              )}
            </TableCell>
            <TableCell>
              {currentlyEditing ? (
                <IconButton aria-label="Edit" onClick={() => stopEditing(i)}>
                  <Check />
                </IconButton>
              ) : (
                <IconButton aria-label="Edit" onClick={() => startEditing(i)}>
                  <Edit />
                </IconButton>
              )}
              <IconButton aria-label="Delete" onClick={() => handleRemove(i)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      </Draggable>
    );
  };

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
                      {dataState.data.map((x: Row, i: number) =>
                        row(
                          x,
                          i,
                          handleRemove,
                          startEditing,
                          stopEditing,
                          handleChange,
                        ),
                      )}
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
