import React from "react";
import HomePage from "./HomePage";
import ReactDOM from "react-dom";
import { cleanup } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000",
  }),
}));

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<HomePage />, div);
  });
});
