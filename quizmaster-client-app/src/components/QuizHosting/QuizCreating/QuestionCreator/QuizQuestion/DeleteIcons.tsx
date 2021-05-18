import React from "react";
import { IconButton } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";

type DeleteIconsProps = {
  i: number;
  handleRemove: (i: number) => void;
  stopEditing: () => void;
  resetEditedQuizQuestion: () => void;
  setCurrentlyDeleting: (currentlyDeleting: boolean) => void;
};

const DeleteIcons = ({
  i,
  handleRemove,
  stopEditing,
  resetEditedQuizQuestion,
  setCurrentlyDeleting,
}: DeleteIconsProps): JSX.Element => {
  return (
    <>
      <IconButton
        size="small"
        aria-label="Edit"
        onClick={() => {
          handleRemove(i);
          stopEditing();
          resetEditedQuizQuestion();
          setCurrentlyDeleting(false);
        }}
      >
        <Check />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Edit"
        onClick={() => {
          setCurrentlyDeleting(false);
        }}
      >
        <Clear />
      </IconButton>
    </>
  );
};

export default DeleteIcons;
