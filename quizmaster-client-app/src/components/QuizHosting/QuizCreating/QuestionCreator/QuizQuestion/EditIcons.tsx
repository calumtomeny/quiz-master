import React from "react";
import { IconButton } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";

type EditIconsProps = {
  stopEditing: () => void;
  cancelEdit: () => void;
};

const EditIcons = ({
  stopEditing,
  cancelEdit,
}: EditIconsProps): JSX.Element => {
  return (
    <>
      <IconButton size="small" aria-label="Edit" onClick={() => stopEditing()}>
        <Check />
      </IconButton>
      <IconButton size="small" aria-label="Edit" onClick={() => cancelEdit()}>
        <Clear />
      </IconButton>
    </>
  );
};

export default EditIcons;
