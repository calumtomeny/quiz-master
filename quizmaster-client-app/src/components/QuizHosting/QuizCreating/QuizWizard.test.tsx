import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import QuizWizard from "./QuizWizard";
import { shallow } from "enzyme";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: "1234",
  }),
  useRouteMatch: () => ({
    url: "/quiz/f37ff3b7-284f-4915-81dd-f1edce15acb4/setup/",
  }),
}));

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    shallow(<QuizWizard />);
  });
});
