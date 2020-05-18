import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HostLobby from './HostLobby';

describe('<HostLobby />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<HostLobby />);
    const hostLobby = getByTestId('HostLobby');

    expect(hostLobby).toBeInTheDocument();
  });
});