import React from 'react';
import { cleanup } from '@testing-library/react';
import App from '../../components/ChatDemo/Chat';
import ReactDOM from 'react-dom';

describe("When testing directly", () => {
  afterEach(cleanup);
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });
});
