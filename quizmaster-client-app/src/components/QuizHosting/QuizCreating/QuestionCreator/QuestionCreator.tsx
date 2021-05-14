import React, {
  useReducer,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import { Box, Grid } from "@material-ui/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Axios from "axios";
import QuestionInitialiser from "./QuestionInitialiser";
import reducer from "./QuestionReducer";
import QuizQuestion from "../../../Common/QuizQuestion";
import QuestionDisplay from "./QuestionDisplay";

export default function QuestionCreator(props: any) {
  const [dataState, dispatch] = useReducer(reducer, {
    data: [],
  });
  const [editedQuizQuestion, setEditedQuizQuestion] = useState<QuizQuestion>({
    question: "",
    answer: "",
    number: 0,
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
        console.log("results: ", results);
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
    ) {
      return;
    }
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

  const resetEditedQuizQuestion = () =>
    setEditedQuizQuestion({
      question: "",
      answer: "",
      number: 0,
    });

  const startEditing = (i: number) => {
    const { question, answer, number } = dataState.data[i];
    setEditIndex(i);
    setCurrentlyEditing(true);
    setEditedQuizQuestion({
      question,
      answer,
      number,
    });
  };

  const stopEditing = () => {
    if (!editedQuizQuestion.question || !editedQuizQuestion.answer) return;
    setEditIndex(-1);
    setCurrentlyEditing(false);
    dispatch({ type: "update", payload: editedQuizQuestion });
    resetEditedQuizQuestion();
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setCurrentlyEditing(false);
    resetEditedQuizQuestion();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.currentTarget;
    if (field === "question")
      setEditedQuizQuestion({ ...editedQuizQuestion, question: value });
    if (field === "answer")
      setEditedQuizQuestion({ ...editedQuizQuestion, answer: value });
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <Grid
                  container
                  spacing={1}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {dataState.data.map(
                    (quizQuestion: QuizQuestion, i: number) => (
                      <QuestionDisplay
                        key={quizQuestion.number}
                        quizQuestion={quizQuestion}
                        i={i}
                        editedQuizQuestion={editedQuizQuestion}
                        currentlyEditing={currentlyEditing}
                        currentlyDeleting={currentlyDeleting}
                        editIndex={editIndex}
                        deleteIndex={deleteIndex}
                        setCurrentlyDeleting={setCurrentlyDeleting}
                        startDeleting={startDeleting}
                        handleRemove={handleRemove}
                        resetEditedQuizQuestion={resetEditedQuizQuestion}
                        startEditing={startEditing}
                        stopEditing={stopEditing}
                        cancelEdit={cancelEdit}
                        handleChange={handleChange}
                      />
                    ),
                  )}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
