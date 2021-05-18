import React, { ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import DragIcon from "./QuizQuestion/DragIcon";
import ModificationIcons from "./QuizQuestion/ModificationIcons";
import Question from "./QuizQuestion/Question";
import Answer from "./QuizQuestion/Answer";
import QuizQuestion from "../../../Common/QuizQuestion";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    content: {
      paddingLeft: "5px",
      paddingRight: "5px",
    },
    action: {
      height: "auto",
      alignSelf: "center",
      marginTop: "0px",
      marginRight: "0px",
    },
  }),
);

type QuestionDisplayProps = {
  quizQuestion: QuizQuestion;
  i: number;
  editedQuizQuestion: QuizQuestion;
  currentlyEditing: boolean;
  currentlyDeleting: boolean;
  editIndex: number;
  deleteIndex: number;
  setCurrentlyDeleting: (currentlyDeleting: boolean) => void;
  startDeleting: (i: number) => void;
  handleRemove: (i: number) => void;
  resetEditedQuizQuestion: () => void;
  startEditing: (i: number) => void;
  stopEditing: () => void;
  cancelEdit: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => void;
};

const QuestionDisplay = ({
  quizQuestion,
  i,
  editedQuizQuestion,
  currentlyEditing,
  currentlyDeleting,
  editIndex,
  deleteIndex,
  setCurrentlyDeleting,
  startDeleting,
  handleRemove,
  resetEditedQuizQuestion,
  startEditing,
  stopEditing,
  cancelEdit,
  handleChange,
}: QuestionDisplayProps): JSX.Element => {
  const classes = useStyles();

  const editingRow = currentlyEditing && editIndex === i;
  const deletingRow = currentlyDeleting && deleteIndex === i;

  return (
    <Grid container item xs={12}>
      <Draggable draggableId={quizQuestion.number.toString()} index={i}>
        {(provided: DraggableProvided) => (
          <Card
            className={classes.root}
            key={quizQuestion.number}
            {...provided.draggableProps}
            innerRef={provided.innerRef}
            variant="outlined"
            raised
          >
            <CardHeader
              avatar={<DragIcon provided={provided} i={i} />}
              title={
                <Question
                  quizQuestion={quizQuestion}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  editedQuizQuestion={editedQuizQuestion}
                  handleChange={handleChange}
                />
              }
              subheader={
                <Answer
                  quizQuestion={quizQuestion}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  editedQuizQuestion={editedQuizQuestion}
                  handleChange={handleChange}
                />
              }
              action={
                <ModificationIcons
                  i={i}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  stopEditing={stopEditing}
                  cancelEdit={cancelEdit}
                  handleRemove={handleRemove}
                  resetEditedQuizQuestion={resetEditedQuizQuestion}
                  setCurrentlyDeleting={setCurrentlyDeleting}
                  startEditing={startEditing}
                  startDeleting={startDeleting}
                  classes={classes.action}
                />
              }
              classes={{ content: classes.content, action: classes.action }}
            ></CardHeader>
          </Card>
        )}
      </Draggable>
    </Grid>
  );
};

export default QuestionDisplay;
