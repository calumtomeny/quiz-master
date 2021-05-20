import React from "react";
import { Grid } from "@material-ui/core";
import DefaultIcons from "./DefaultIcons";
import DeleteIcons from "./DeleteIcons";
import EditIcons from "./EditIcons";

type ModificationIconsProps = {
  i: number;
  editingRow: boolean;
  deletingRow: boolean;
  stopEditing: () => void;
  cancelEdit: () => void;
  handleRemove: (i: number) => void;
  resetEditedQuizQuestion: () => void;
  setCurrentlyDeleting: (currentlyDeleting: boolean) => void;
  startEditing: (i: number) => void;
  startDeleting: (i: number) => void;
  classes?: any;
};

const ModificationIcons = ({
  i,
  editingRow,
  deletingRow,
  stopEditing,
  cancelEdit,
  handleRemove,
  resetEditedQuizQuestion,
  setCurrentlyDeleting,
  startEditing,
  startDeleting,
  classes,
}: ModificationIconsProps) => {
  return (
    <Grid
      container
      item
      xs={12}
      direction="column"
      justify="space-between"
      alignItems="center"
      className={classes}
    >
      {editingRow ? (
        <EditIcons stopEditing={stopEditing} cancelEdit={cancelEdit} />
      ) : deletingRow ? (
        <DeleteIcons
          i={i}
          handleRemove={handleRemove}
          stopEditing={stopEditing}
          resetEditedQuizQuestion={resetEditedQuizQuestion}
          setCurrentlyDeleting={setCurrentlyDeleting}
        />
      ) : (
        <DefaultIcons
          i={i}
          startEditing={startEditing}
          startDeleting={startDeleting}
        />
      )}
    </Grid>
  );
};

export default ModificationIcons;
