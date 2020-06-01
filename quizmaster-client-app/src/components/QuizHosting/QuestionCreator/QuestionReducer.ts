import Row from "./Row";

function Reducer(state: any, action: any) {
  let data: Row[] = [...state.data];
  switch (action.type) {
    case "add":
      data.push(action.payload);
      return {
        ...state,
        data,
      };
    case "update":
      data = state.data.map((x: any) =>
        x.number === action.payload.number ? action.payload : x
      );
      return { ...state, data };
    case "delete":
      debugger;
      data = state.data.filter((x: any) => x !== action.payload);
      return { ...state, data };
    case "set":
      data = action.payload;
      return {
        ...state,
        data,
      };
  }
}

export default Reducer;
