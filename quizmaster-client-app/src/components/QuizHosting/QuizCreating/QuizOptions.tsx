import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Paper,
  TableContainer,
  TextField,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useParams } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  tableheader: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
  },
  tableheaderCell: {
    color: "#ffffff",
  },
  optionValue: {
    width: "100%",
  },
}));

export default function QuizOptions(props: {
  questionTimeInSeconds: number;
  onUpdateQuestionTime: (seconds: number) => void;
}) {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [editFieldError, setEditFieldError] = useState({
    error: false,
    label: "",
    helperText: "",
    validateInput: false,
  });
  const timeInSecondsOptionName = "Number of seconds to answer each question";
  const [optionsTableData, setOptionsTableData] = useState([
    {
      optionName: timeInSecondsOptionName,
      optionValue: props.questionTimeInSeconds,
    },
  ]);

  const tableColumns = [
    {
      title: "",
      field: "optionName",
      editable: "never",
    },
    {
      title: "",
      field: "optionValue",
      // eslint-disable-next-line react/display-name
      editComponent: (props: any) => (
        <TextField
          className={classes.optionValue}
          type="number"
          value={props.value ? props.value : ""}
          onChange={(e) => props.onChange(e.target.value)}
          error={editFieldError.validateInput ? editFieldError.error : false}
          label={editFieldError.validateInput ? editFieldError.helperText : ""}
        />
      ),
    },
  ];

  const [columnsState, setColumnsState] = useState<any>(tableColumns);
  useEffect(() => {
    setColumnsState(tableColumns);
  }, [editFieldError]);

  const updateOptionValueState = (optionName: string, newOptionValue: any) => {
    const newData = optionsTableData.map((x: any) => {
      if (x.optionName === optionName) {
        return { optionName: x.optionName, optionValue: newOptionValue };
      } else {
        return { optionName: x.optionName, optionValue: x.optionValue };
      }
    });
    setOptionsTableData(newData);
    if (optionName === timeInSecondsOptionName) {
      axios.post(`/api/quizzes/${id}`, {
        QuestionTimeInSeconds: parseInt(newOptionValue),
      });
      props.onUpdateQuestionTime(parseInt(newOptionValue));
    }
  };

  return (
    <TableContainer component={Paper}>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          options={{
            actionsColumnIndex: -1,
            draggable: false,
            filtering: false,
            paging: false,
            search: false,
            toolbar: false,
            sorting: false,
          }}
          localization={{
            header: {
              actions: "",
            },
          }}
          columns={columnsState}
          data={optionsTableData}
          title="Quiz Options"
          editable={{
            onRowUpdate: (newData: any, oldData: any) =>
              new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                  const secondsStr = String(newData.optionValue);
                  if (secondsStr === "") {
                    setColumnsState([]);
                    setEditFieldError({
                      error: true,
                      label: "required",
                      helperText: "Required",
                      validateInput: true,
                    });
                    reject();
                    return;
                  } else if (
                    !secondsStr.match(/\d+/) ||
                    parseInt(secondsStr) < 5 ||
                    parseInt(secondsStr) > 300
                  ) {
                    setEditFieldError({
                      error: true,
                      label: "mustbeint",
                      helperText: "Must be a whole number between 5 and 300",
                      validateInput: true,
                    });
                    reject();
                    return;
                  } else {
                    resolve();
                    if (oldData) {
                      updateOptionValueState(
                        newData.optionName,
                        newData.optionValue,
                      );
                    }
                  }
                }, 600);
              }),
          }}
        />
      </div>
    </TableContainer>
  );
}
