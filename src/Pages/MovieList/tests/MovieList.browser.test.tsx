import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { MovieListPage } from '../MovieListPage';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { GET_ALL_MOVIES } from '../../../api/queries';

const mocks = [
  {
    request: {
      query: GET_ALL_MOVIES,
      variables: {
        limit: 100,
        searchTerm: ''
      }
    },
    result: {
      data: {
        allMovies: []
      }
    }
  }
];

test.skip('Check to see if page with no movies renders correctly', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/']}>
        <MovieListPage />
      </MemoryRouter>
    </MockedProvider>
  );

  await waitFor(() => screen.getByText(`Here's a List of Movies`));

  expect(container).toMatchSnapshot();
  expect(screen.getByText(`Here's a List of Movies`)).toBeTruthy();
});
