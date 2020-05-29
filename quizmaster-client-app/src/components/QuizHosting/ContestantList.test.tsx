import React from "react";
import ReactDOM from "react-dom";
import ContestantList from "./ContestantList";
import { cleanup } from "@testing-library/react";

describe("When testing directly", () => {
  let contestantList = ["Dave", "Sarah"];
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ContestantList contestants={contestantList} />, div);
  });
});
