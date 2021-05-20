import { IconButton } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";
import React from "react";

export default function EditIcons(props: any) {
  return (
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
  );
}
