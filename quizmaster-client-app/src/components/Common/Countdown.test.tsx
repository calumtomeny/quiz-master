import React from "react";
import ReactDOM from "react-dom";
import LinearDeterminate from "./Countdown";
import { cleanup } from "@testing-library/react";

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<LinearDeterminate />, div);
  });
});
