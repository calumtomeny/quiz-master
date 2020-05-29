import React from "react";
import ReactDOM from "react-dom";
import Chat from "./Chat";

describe("When testing directly", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Chat />, div);
  });
});
