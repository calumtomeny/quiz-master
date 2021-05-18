import React from "react";
import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";

type DefaultIconsProps = {
  i: number;
  startEditing: (i: number) => void;
  startDeleting: (i: number) => void;
};

const DefaultIcons = ({
  i,
  startEditing,
  startDeleting,
}: DefaultIconsProps): JSX.Element => {
  return (
    <>
      <IconButton
        size="small"
        aria-label="Edit"
        onClick={() => startEditing(i)}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Delete"
        onClick={() => startDeleting(i)}
      >
        <Delete />
      </IconButton>
    </>
  );
};

export default DefaultIcons;
