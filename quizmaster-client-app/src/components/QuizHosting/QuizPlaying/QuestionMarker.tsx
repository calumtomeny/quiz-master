import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { lightGreen } from "@material-ui/core/colors";
import QuestionResponse from "./QuestionResponse";
import { Switch, withStyles, Fab, Zoom } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Navigation";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function findSetDifference<T>(
  setA: Set<T> | Array<T>,
  setB: Set<T> | Array<T>,
) {
  const _difference = new Set(setA);
  setB.forEach((elem: T) => _difference.delete(elem));
  return _difference;
}

function findSetUnion<T>(setA: Set<T> | Array<T>, setB: Set<T> | Array<T>) {
  const _union = new Set(setA);
  setB.forEach((elem: T) => _union.add(elem));
  return _union;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  }),
);

const transitionDuration = {
  enter: 200,
  exit: 100,
};

const CustomSwitch = withStyles({
  colorPrimary: {
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "green",
      color: lightGreen,
    },
  },
  track: {
    backgroundColor: "red",
    opacity: 1,
  },
  thumb: {
    backgroundColor: "white",
  },
})(Switch);

const useFabStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
);

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof QuestionResponse;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "answer", numeric: false, disablePadding: false, label: "Answer" },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "answerTimeLeftAsAPercentage",
    numeric: true,
    disablePadding: false,
    label: "Time Remaining (%)",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof QuestionResponse,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof QuestionResponse) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight: {
      color: theme.palette.success.main,
      backgroundColor: lighten(theme.palette.success.light, 0.85),
    },
    title: {
      flex: "1 1 100%",
    },
  }),
);
const useTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: lighten(theme.palette.success.light, 0.85),
      },
    },
    hover: {},
    selected: {},
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} correct
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Answers
        </Typography>
      )}
    </Toolbar>
  );
};

export default function QuestionMarker(props: {
  rows: QuestionResponse[];
  answer: string;
  onAcceptAnswers: any;
  showContinueAction: boolean;
}) {
  const tableClasses = useTableStyles();
  const classes = useStyles();
  const fabClasses = useFabStyles();
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof QuestionResponse>("name");
  const [selected, setSelected] = useState<string[]>([]);
  const [manuallySelected, setManuallySelected] = useState<Set<string>>(
    new Set([]),
  );
  const [manuallyDeselected, setManuallyDeselected] = useState<Set<string>>(
    new Set([]),
  );
  const [autoSelected, setAutoSelected] = useState<Set<string>>(new Set([]));

  useEffect(() => {
    console.log("doing stuff...");
    const newAutoSelected = new Set(
      props.rows
        .filter(
          (x) =>
            (x.answer.toLowerCase() === props.answer.toLowerCase() &&
              !manuallyDeselected.has(x.id)) ||
            manuallySelected.has(x.id),
        )
        .map((x) => x.id),
    );
    setAutoSelected(newAutoSelected);
    setSelected(Array.from(newAutoSelected));
  }, [props.answer, props.rows, manuallyDeselected, manuallySelected]);

  const onAcceptAnswers = () => {
    const correctAnswers = props.rows.filter((x) => selected.includes(x.id));
    props.onAcceptAnswers(correctAnswers);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof QuestionResponse,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = props.rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const newManuallySelected = new Set<string>(manuallySelected);
    const newManuallyDeselected = new Set<string>(manuallyDeselected);

    if (newManuallySelected.has(name)) {
      newManuallySelected.delete(name);
      newManuallyDeselected.add(name);
    } else if (newManuallyDeselected.has(name)) {
      newManuallyDeselected.delete(name);
      newManuallySelected.add(name);
    } else if (selected.includes(name)) {
      newManuallyDeselected.add(name);
    } else {
      newManuallySelected.add(name);
    }
    let newSelected = findSetDifference(autoSelected, newManuallyDeselected);
    newSelected = findSetUnion(newSelected, newManuallySelected);
    setSelected(Array.from(newSelected));
    setManuallySelected(newManuallySelected);
    setManuallyDeselected(newManuallyDeselected);
  };

  const isSelected = (name: string) => {
    return selected.indexOf(name) !== -1;
  };

  return (
    <>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={"small"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={props.rows.length}
          />
          <TableBody>
            {stableSort(props.rows, getComparator(order, orderBy)).map(
              (row) => {
                const isItemSelected = isSelected(row.id);

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    classes={{
                      hover: tableClasses.hover,
                      selected: tableClasses.selected,
                    }}
                    className={tableClasses.tableRow}
                  >
                    <TableCell padding="checkbox">
                      <CustomSwitch
                        onClick={(event: any) => handleClick(event, row.id)}
                        checked={isItemSelected}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{row.answer}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      {row.answerTimeLeftAsAPercentage}
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
        <Zoom
          key="primary"
          in={props.showContinueAction}
          timeout={transitionDuration}
          unmountOnExit
        >
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            className={fabClasses.margin}
            onClick={onAcceptAnswers}
          >
            <DoneIcon className={fabClasses.extendedIcon} />
            Calculate scores and prepare next question
          </Fab>
        </Zoom>
      </TableContainer>
    </>
  );
}
