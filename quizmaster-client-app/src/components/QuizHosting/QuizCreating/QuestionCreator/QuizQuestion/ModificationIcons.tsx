import React from "react";
import { Grid } from "@material-ui/core";
import DefaultIcons from "./DefaultIcons";
import DeleteIcons from "./DeleteIcons";
import EditIcons from "./EditIcons";

export default function ModificationIcons(props: any) {
  return (
    <Grid
      container
      item
      xs={12}
      direction="column"
      justify="space-between"
      alignItems="center"
      className={props.classes}
    >
      {props.editingRow ? (
        <EditIcons
          stopEditing={props.stopEditing}
          cancelEdit={props.cancelEdit}
        />
      ) : props.deletingRow ? (
        <DeleteIcons
          i={props.i}
          handleRemove={props.handleRemove}
          stopEditing={props.stopEditing}
          resetEditedQuizQuestion={props.resetEditedQuizQuestion}
          setCurrentlyDeleting={props.setCurrentlyDeleting}
        />
      ) : (
        <DefaultIcons
          i={props.i}
          startEditing={props.startEditing}
          startDeleting={props.startDeleting}
        />
      )}
    </Grid>
  );
}
