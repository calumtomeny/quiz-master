import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Layout from "./Layout";
import ReactDOM from "react-dom";

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
    ReactDOM.render(<Layout />, div);
  });
});
