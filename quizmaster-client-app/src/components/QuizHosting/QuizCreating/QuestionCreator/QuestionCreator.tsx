import React, {
  useReducer,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import Axios from "axios";
import QuizQuestion from "../../../Common/QuizQuestion";
// import { makeStyles } from "@material-ui/core/styles";
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
  Typography,
} from "@material-ui/core";
import { Edit, Delete, Check, DragHandle, Clear } from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import reducer from "./QuestionReducer";
import QuestionInitialiser from "./QuestionInitialiser";
import Row from "./Row";

// const useStyles = makeStyles(() => ({}));

export default function QuestionCreator(props: any) {
  // const classes = useStyles();

  const [dataState, dispatch] = useReducer(reducer, {
    data: [],
  });
  const [editQAndA, setEditQAndA] = useState<Row>({
    number: 0,
    question: "",
    answer: "",
  });
  const [currentlyEditing, setCurrentlyEditing] = useState<boolean>(false);
  const [currentlyDeleting, setCurrentlyDeleting] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [doneInitialGet, setDoneInitialGet] = useState<boolean>(false);
  const isFirstRun = useRef(true);
  const [isInitialQuestion, setIsInitialQuestion] = useState<boolean>(true);
  const [questionsLoadingInProgress, setQuestionsLoadingInProgress] = useState(
    false,
  );

  const setQuestion = (question: string, answer: string) => {
    dispatch({ type: "add", payload: { question: question, answer: answer } });
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
    if (currentlyEditing || currentlyDeleting) {
      setEditIndex(destination.index);
      setDeleteIndex(destination.index);
    }
  };

  const startDeleting = (i: number) => {
    setDeleteIndex(i);
    setCurrentlyDeleting(true);
  };

  const handleRemove = (i: number) => {
    setCurrentlyDeleting(false);
    setEditIndex(-1);
    setDeleteIndex(-1);
    dispatch({ type: "delete", payload: dataState.data[i] });
  };

  const resetEditQAndA = () =>
    setEditQAndA({
      number: 0,
      question: "",
      answer: "",
    });

  const startEditing = (i: number) => {
    const { number, question, answer } = dataState.data[i];
    setEditIndex(i);
    setCurrentlyEditing(true);
    setEditQAndA({ number, question, answer });
  };

  const stopEditing = () => {
    if (!editQAndA.question || !editQAndA.answer) return;
    setEditIndex(-1);
    setCurrentlyEditing(false);
    dispatch({ type: "update", payload: editQAndA });
    resetEditQAndA();
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setCurrentlyEditing(false);
    resetEditQAndA();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.currentTarget;
    if (field === "question") setEditQAndA({ ...editQAndA, question: value });
    if (field === "answer") setEditQAndA({ ...editQAndA, answer: value });
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

  const row = (
    x: Row,
    i: number,
    handleRemove: any,
    startEditing: any,
    stopEditing: any,
    handleChange: any,
  ) => {
    const editingRow = currentlyEditing && editIndex === i;
    const deletingRow = currentlyDeleting && deleteIndex === i;
    return (
      <Draggable key={x.number} draggableId={x.number.toString()} index={i}>
        {(provided) => (
          <TableRow
            key={x.number}
            {...provided.draggableProps}
            innerRef={provided.innerRef}
          >
            <TableCell align="justify" {...provided.dragHandleProps}>
              <DragHandle />
            </TableCell>
            <TableCell component="th" scope="row">
              {i + 1}
            </TableCell>
            <TableCell>
              {editingRow ? (
                <TextField
                  variant="standard"
                  margin="normal"
                  size="small"
                  error={!editQAndA.question}
                  fullWidth
                  label={!editQAndA.question ? "Required" : "Question"}
                  onChange={(e) => handleChange(e, "question")}
                  value={editQAndA.question}
                />
              ) : deletingRow ? (
                <>
                  <Typography variant="body1" color="error">
                    Are you sure you want to delete this?
                  </Typography>
                </>
              ) : (
                x.question
              )}
            </TableCell>
            <TableCell>
              {editingRow ? (
                <TextField
                  variant="standard"
                  margin="normal"
                  size="small"
                  error={!editQAndA.answer}
                  required
                  fullWidth
                  label={!editQAndA.answer ? "Required" : "Answer"}
                  onChange={(e) => handleChange(e, "answer")}
                  value={editQAndA.answer}
                />
              ) : deletingRow ? (
                <></>
              ) : (
                x.answer
              )}
            </TableCell>
            {editingRow ? (
              <>
                <TableCell>
                  <IconButton aria-label="Edit" onClick={() => stopEditing()}>
                    <Check />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="Edit" onClick={() => cancelEdit()}>
                    <Clear />
                  </IconButton>
                </TableCell>
              </>
            ) : deletingRow ? (
              <>
                <TableCell>
                  <IconButton
                    aria-label="Edit"
                    onClick={() => {
                      handleRemove(i);
                      stopEditing();
                      resetEditQAndA();
                      setCurrentlyDeleting(false);
                    }}
                  >
                    <Check />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Edit"
                    onClick={() => {
                      setCurrentlyDeleting(false);
                    }}
                  >
                    <Clear />
                  </IconButton>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  <IconButton aria-label="Edit" onClick={() => startEditing(i)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => startDeleting(i)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </>
            )}
          </TableRow>
        )}
      </Draggable>
    );
  };

  // disable drag and drop for only one item

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
                  <TableCell>{/* Drag Handle */}</TableCell>
                  <TableCell>{/* Number */}</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>{currentlyDeleting ? "" : "Answer"}</TableCell>
                  <TableCell>{/* Icon */}</TableCell>
                  <TableCell>{/* Icon */}</TableCell>
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
          <></>
        )}
      </Box>
    </>
  );
}
