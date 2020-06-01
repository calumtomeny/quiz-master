import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import QuizStandings from "./QuizStandings";
import ReactDOM from "react-dom";
import Contestant from "./Contestant";

describe("When testing directly", () => {
  const contestants: Contestant[] = [
    { score: 2, name: "Sarah", id: "123" },
    { score: 1, name: "David", id: "456" },
  ];

  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<QuizStandings contestantStandings={contestants} />, div);
  });
});
