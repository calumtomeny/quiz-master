import React from "react";
import { cleanup } from "@testing-library/react";
import ReactDOM from "react-dom";
import App from "./App";

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });
});
