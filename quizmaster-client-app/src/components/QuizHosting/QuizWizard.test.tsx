import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContestantList from './ContestantList';

describe('<ContestantList />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<ContestantList />);
    const contestantList = getByTestId('ContestantList');

    expect(contestantList).toBeInTheDocument();
  });
});