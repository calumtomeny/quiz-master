import React from "react";
import {
  Card,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
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

export default function QuestionDisplay(props: {
  quizQuestion: QuizQuestion;
  i: number;
  editedQuizQuestion: QuizQuestion;
  currentlyEditing: boolean;
  currentlyDeleting: boolean;
  editIndex: number;
  deleteIndex: number;
  setCurrentlyDeleting: any;
  startDeleting: any;
  handleRemove: any;
  resetEditedQuizQuestion: any;
  startEditing: any;
  stopEditing: any;
  cancelEdit: any;
  handleChange: any;
}) {
  const classes = useStyles();

  const editingRow = props.currentlyEditing && props.editIndex === props.i;
  const deletingRow = props.currentlyDeleting && props.deleteIndex === props.i;

  return (
    <Grid container item xs={12}>
      <Draggable
        draggableId={props.quizQuestion.number.toString()}
        index={props.i}
      >
        {(provided) => (
          <Card
            className={classes.root}
            key={props.quizQuestion.number}
            {...provided.draggableProps}
            innerRef={provided.innerRef}
            variant="outlined"
            raised
          >
            <CardHeader
              avatar={<DragIcon provided={provided} i={props.i} />}
              title={
                <Question
                  quizQuestion={props.quizQuestion}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  editedQuizQuestion={props.editedQuizQuestion}
                  handleChange={props.handleChange}
                />
              }
              subheader={
                <Answer
                  quizQuestion={props.quizQuestion}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  editedQuizQuestion={props.editedQuizQuestion}
                  handleChange={props.handleChange}
                />
              }
              action={
                <ModificationIcons
                  i={props.i}
                  editingRow={editingRow}
                  deletingRow={deletingRow}
                  stopEditing={props.stopEditing}
                  cancelEdit={props.cancelEdit}
                  handleRemove={props.handleRemove}
                  resetEditedQuizQuestion={props.resetEditedQuizQuestion}
                  setCurrentlyDeleting={props.setCurrentlyDeleting}
                  startEditing={props.startEditing}
                  startDeleting={props.startDeleting}
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
}
