import React from "react";
import { TextField } from "@material-ui/core";

export default function TableFieldEditor(props: any) {
  return (
    <TextField
      value={props.value}
      fullWidth
      multiline
      required
      onChange={(e) => props.onChange(e.target.value)}
      autoFocus={props.columnDef.tableData.columnOrder === 0 ? true : false}
    />
  );
}
