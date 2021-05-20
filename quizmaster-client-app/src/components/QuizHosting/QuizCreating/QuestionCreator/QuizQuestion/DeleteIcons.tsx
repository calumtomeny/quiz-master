import { IconButton } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";
import React from "react";

export default function DeleteIcons(props: any) {
  return (
    <>
      <IconButton
        size="small"
        aria-label="Edit"
        onClick={() => {
          props.handleRemove(props.i);
          props.stopEditing();
          props.resetEditedQuizQuestion();
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
  );
}
