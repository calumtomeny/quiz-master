import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuestionCreator from './QuestionCreator';
import ReactDOM from 'react-dom';

describe('When testing directly', () => {
  afterEach(cleanup);
  test('renders without crashing', () => {
    const div = document.createElement("div");
    ReactDOM.render(<QuestionCreator />, div);
  });
});