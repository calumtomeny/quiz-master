import Row from "./Row";

function Reducer(state: any, action: any) {
  let data: Row[] = [...state.data];
  switch (action.type) {
    case "add":
      data.push(action.payload);
      data = data.map((x, i) => {
        x.number = i + 1;
        return { ...x };
      });
      return {
        ...state,
        data,
      };
    case "update":
      data = state.data.map((x: any) =>
        x.number === action.payload.number ? action.payload : x,
      );
      return { ...state, data };
    case "dragAndDrop":
      data = action.payload;
      return { data };
    case "delete":
      data = state.data.filter((x: any) => x !== action.payload);
      return { ...state, data };
    case "set":
      data = action.payload;
      data.sort((n1: Row, n2: Row) => n1.number - n2.number);
      return {
        ...state,
        data,
      };
  }
}

export default Reducer;
