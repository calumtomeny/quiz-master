import { Column } from "material-table";
import Row from "./Row";

interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
}

export default TableState;
