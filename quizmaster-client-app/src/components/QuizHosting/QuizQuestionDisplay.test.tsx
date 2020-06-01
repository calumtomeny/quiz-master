import React from 'react';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuizQuestionDisplay from './QuizQuestionDisplay';
import ReactDOM from 'react-dom';
import QuizQuestion from '../Common/QuizQuestion';

const quizQuestion: QuizQuestion = new QuizQuestion("What is 1 + 1?", "2", 1);

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<QuizQuestionDisplay quizQuestion={quizQuestion} timeLeftAsAPercentage={50}/>, div);
  });
});
