import React, { KeyboardEvent } from "react";
import {
  Card,
  CardHeader,
  createStyles,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Check, Clear, Delete, DragIndicator, Edit } from "@material-ui/icons";
import { Draggable } from "react-beautiful-dnd";
import Row from "./Row";

const useStyles = makeStyles((theme: Theme) =>
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
    handle: {
      color: theme.palette.grey[500],
    },
  }),
);

const preventEnter = (e: KeyboardEvent<HTMLDivElement>) => {
  if (e.keyCode === 13) e.preventDefault();
};

export default function Question(props: {
  x: Row;
  i: number;
  editQAndA: Row;
  currentlyEditing: boolean;
  currentlyDeleting: boolean;
  editIndex: number;
  deleteIndex: number;
  setCurrentlyDeleting: any;
  startDeleting: any;
  handleRemove: any;
  resetEditQAndA: any;
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
      <Draggable draggableId={props.x.number.toString()} index={props.i}>
        {(provided) => (
          <Card
            className={classes.root}
            key={props.x.number}
            {...provided.draggableProps}
            innerRef={provided.innerRef}
            variant="outlined"
            raised
          >
            <CardHeader
              avatar={
                <Grid
                  container
                  item
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Icon
                    className={classes.handle}
                    {...provided.dragHandleProps}
                  >
                    <DragIndicator />
                  </Icon>
                  <Typography variant="button">{props.i + 1}</Typography>
                </Grid>
              }
              action={
                <Grid
                  container
                  item
                  xs={12}
                  direction="column"
                  justify="space-between"
                  alignItems="center"
                  className={classes.action}
                >
                  {editingRow ? (
                    <>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => props.stopEditing()}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => props.cancelEdit()}
                      >
                        <Clear />
                      </IconButton>
                    </>
                  ) : deletingRow ? (
                    <>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => {
                          props.handleRemove(props.i);
                          props.stopEditing();
                          props.resetEditQAndA();
                          props.setCurrentlyDeleting(false);
                        }}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => {
                          props.setCurrentlyDeleting(false);
                        }}
                      >
                        <Clear />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => props.startEditing(props.i)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Delete"
                        onClick={() => props.startDeleting(props.i)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Grid>
              }
              title={
                <Grid item xs={12}>
                  {editingRow ? (
                    <TextField
                      variant="outlined"
                      margin="normal"
                      size="small"
                      multiline
                      onKeyDown={(e) => preventEnter(e)}
                      error={!props.editQAndA.question}
                      fullWidth
                      label={
                        !props.editQAndA.question ? "Required" : "Question"
                      }
                      onChange={(e) => props.handleChange(e, "question")}
                      value={props.editQAndA.question}
                    />
                  ) : deletingRow ? (
                    <>
                      <Typography variant="body1" color="error">
                        Are you sure you want to delete this?
                      </Typography>
                    </>
                  ) : (
                    <Typography gutterBottom variant="body1">
                      {props.x.question}
                    </Typography>
                  )}
                </Grid>
              }
              subheader={
                editingRow ? (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    size="small"
                    error={!props.editQAndA.answer}
                    required
                    fullWidth
                    label={!props.editQAndA.answer ? "Required" : "Answer"}
                    onChange={(e) => props.handleChange(e, "answer")}
                    value={props.editQAndA.answer}
                  />
                ) : deletingRow ? (
                  <></>
                ) : (
                  <Typography variant="body2">{props.x.answer}</Typography>
                )
              }
              classes={{ content: classes.content, action: classes.action }}
            ></CardHeader>
          </Card>
        )}
      </Draggable>
    </Grid>
  );
}
