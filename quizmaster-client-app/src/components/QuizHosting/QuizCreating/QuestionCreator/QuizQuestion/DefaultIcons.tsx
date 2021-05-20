import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import React from "react";

export default function DefaultIcons(props: any) {
  return (
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
  );
}
