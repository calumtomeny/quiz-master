import React from "react";
import { TextareaAutosize } from "@material-ui/core";

export default function TableFieldEditor(props: any) {
  return (
    <TextareaAutosize
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      autoFocus={true}
    />
  );
}
