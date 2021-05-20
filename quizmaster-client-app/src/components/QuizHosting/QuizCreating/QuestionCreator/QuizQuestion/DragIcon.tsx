import {
  createStyles,
  Grid,
  Icon,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    handle: {
      color: theme.palette.grey[500],
    },
  }),
);

export default function DragIcon(props: any) {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Icon className={classes.handle} {...props.provided.dragHandleProps}>
        <DragIndicator />
      </Icon>
      <Typography variant="button">{props.i + 1}</Typography>
    </Grid>
  );
}
