import React from "react";
import { cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import QuestionCreator from "./QuestionCreator";
import ReactDOM from "react-dom";
import TableState from "./TableState";
import reducer from "./QuestionReducer";
import Row from "./Row";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("When testing directly", () => {
  afterEach(cleanup);
  test("renders without crashing", () => {
    const mock = new MockAdapter(Axios);
    mock.onGet("/api/quizzes/123/questions").reply(200, []);
    const div = document.createElement("div");
    act(() => {
      ReactDOM.render(<QuestionCreator quizId={123} />, div);
    });
  });
});

describe("Reducer", () => {
  test("Adds new row", () => {
    let state: TableState = {
      columns: [
        { title: "Question", field: "question" },
        { title: "Answer", field: "answer" },
      ],
      data: [],
    };

    const row1: Row = {
      number: 2,
      question: "Test question1",
      answer: "Test answer",
    };

    const row2: Row = {
      number: 2,
      question: "Test question2",
      answer: "Test answer2",
    };

    state = reducer(state, { type: "add", payload: row1 });
    expect(state.data.length).toBe(1);
    state = reducer(state, { type: "add", payload: row2 });
    expect(state.data.length).toBe(2);
  });

  test("Updates row", () => {
    let state: TableState = {
      columns: [
        { title: "Question", field: "question" },
        { title: "Answer", field: "answer" },
      ],
      data: [
        {
          number: 1,
          question: "Test question1",
          answer: "Test answer1",
        },
        {
          number: 2,
          question: "Test question2",
          answer: "Test answer2",
        },
      ],
    };

    state = reducer(state, {
      type: "update",
      payload: {
        number: 2,
        question: "UpdatedQuestion",
        answer: "UpdatedAnswer",
      },
    });
    expect(state.data.find((x) => x.number === 2)?.question).toEqual(
      "UpdatedQuestion",
    );
    expect(state.data.find((x) => x.number === 2)?.answer).toEqual(
      "UpdatedAnswer",
    );
    expect(state.data.find((x) => x.number === 1)?.question).not.toEqual(
      "UpdatedQuestion",
    );
    expect(state.data.find((x) => x.number === 1)?.answer).not.toEqual(
      "UpdatedAnswer",
    );
  });

  test("Deletes rows", () => {
    let state: TableState = {
      columns: [
        { title: "Question", field: "question" },
        { title: "Answer", field: "answer" },
      ],
      data: [
        {
          number: 1,
          question: "Test question1",
          answer: "Test answer1",
        },
        {
          number: 2,
          question: "Test question2",
          answer: "Test answer2",
        },
      ],
    };

    state = reducer(state, {
      type: "delete",
      payload: state.data[0],
    });

    expect(state.data.length).toBe(1);
    expect(state.data[0].question).toBe("Test question2");
    expect(state.data[0].answer).toBe("Test answer2");
  });

  test("Adds rows", () => {
    let state: TableState = {
      columns: [
        { title: "Question", field: "question" },
        { title: "Answer", field: "answer" },
      ],
      data: [],
    };

    const rows: Row[] = [
      {
        number: 1,
        question: "Test question1",
        answer: "Test answer1",
      },
      {
        number: 2,
        question: "Test question2",
        answer: "Test answer2",
      },
    ];

    state = reducer(state, {
      type: "set",
      payload: rows,
    });

    expect(state.data.length).toBe(2);
    expect(state.data[0].question).toBe("Test question1");
    expect(state.data[0].answer).toBe("Test answer1");
    expect(state.data[1].question).toBe("Test question2");
    expect(state.data[1].answer).toBe("Test answer2");
  });
});
