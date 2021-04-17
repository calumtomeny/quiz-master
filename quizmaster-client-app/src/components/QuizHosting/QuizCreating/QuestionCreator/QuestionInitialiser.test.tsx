import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactDOM from "react-dom";
import QuestionInitialiser from "./QuestionInitialiser";
import { shallow } from "enzyme";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000",
  }),
}));

describe("When testing question initialiser directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<QuestionInitialiser />, div);
  });

  it("has question input", () => {
    const wrapper = shallow(<QuestionInitialiser />);
    expect(wrapper.find('[data-testid="question-input"]').length).toEqual(1);
  });

  it("has answer input", () => {
    const wrapper = shallow(<QuestionInitialiser />);
    expect(wrapper.find('[data-testid="answer-input"]').length).toEqual(1);
  });

  it("has add question button", () => {
    const wrapper = shallow(<QuestionInitialiser />);
    expect(wrapper.find('[data-testid="add-question-button"]').length).toEqual(
      1,
    );
  });
});
