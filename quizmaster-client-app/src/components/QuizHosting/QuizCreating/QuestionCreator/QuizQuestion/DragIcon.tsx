import React from "react";
import {
  createStyles,
  Grid,
  Icon,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import { DraggableProvided } from "react-beautiful-dnd";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    handle: {
      color: theme.palette.grey[500],
    },
  }),
);

type DragIconProps = {
  provided: DraggableProvided;
  i: number;
};

const DragIcon = ({ provided, i }: DragIconProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Icon className={classes.handle} {...provided.dragHandleProps}>
        <DragIndicator />
      </Icon>
      <Typography variant="button">{i + 1}</Typography>
    </Grid>
  );
};

export default DragIcon;
