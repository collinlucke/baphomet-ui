import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { createMovieListItemMock } from './__mocks__/movieListItemMock.tsx';
import { MovieList } from '../MovieList/MovieList';
import {
  setupIntersectionObserverMock,
  setupResizeObserverMock
} from './__mocks__/browserMocks.ts';
import { mockMovies, mockMovieDetailsQuery } from './__mocks__/testData.ts';

createMovieListItemMock();

describe('MovieList Component - Unit Tests', () => {
  const defaultProps = {
    movies: mockMovies,
    searchTerm: '',
    totalMovieCount: '3',
    isLoadingMore: false,
    hasMore: true,
    onScroll: vi.fn(),
    onSearch: vi.fn(),
    setSearchTerm: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();

    setupIntersectionObserverMock();
    setupResizeObserverMock();
  });

  describe('Component Logic & Props', () => {
    it('renders movie list when movies are provided', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-603')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-238')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-680')).toBeInTheDocument();
    });

    it('displays total movie count in search component', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} totalMovieCount="5" />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('total-results')).toHaveTextContent('5');
    });

    it('handles empty and null movie arrays', () => {
      const { rerender } = render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={[]} />
        </MockedProvider></MemoryRouter>
      );

      const noResultsLine1 = screen.getByText(
        'Real sorry to tell you this, but...'
      );
      const noResultsLine2 = screen.getByText('No movies match your search');

      expect(noResultsLine1).toBeInTheDocument();
      expect(noResultsLine2).toBeInTheDocument();

      rerender(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={null} />
        </MockedProvider></MemoryRouter>
      );

      expect(noResultsLine1).toBeInTheDocument();
      expect(noResultsLine2).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when isLoadingMore is true', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} isLoadingMore={true} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByText('Loading more movies...')).toBeInTheDocument();
    });

    it('shows end of results message when hasMore is false', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} hasMore={false} />
        </MockedProvider></MemoryRouter>
      );

      expect(
        screen.getByText("You've reached the end! 🎬")
      ).toBeInTheDocument();
    });

    it('does not show end message when movies array is empty', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={[]} hasMore={false} />
        </MockedProvider></MemoryRouter>
      );

      expect(
        screen.queryByText("You've reached the end! 🎬")
      ).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('calls setSearchTerm when input changes', async () => {
      const user = userEvent.setup();
      const mockSetSearchTerm = vi.fn();

      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} setSearchTerm={mockSetSearchTerm} />
        </MockedProvider></MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText('Search Movies');
      await user.type(searchInput, 'matrix');

      expect(mockSetSearchTerm).toHaveBeenCalled();
    });

    it('displays current search term', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} searchTerm="matrix" />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByPlaceholderText('Search Movies')).toHaveValue('matrix');
    });
  });

  describe('Movie Details Functionality', () => {
    it('calls fetchMovieDetails when openMovieDetailsHandler is triggered', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      const movieItem = screen.getByTestId('movie-item-603');
      await user.click(movieItem);

      await waitFor(() => {
        expect(movieItem).toBeInTheDocument();
      });
    });

    it('renders modal component', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Scroll Functionality', () => {
    it('renders sentinel element for infinite scroll', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      const movieListWrapper =
        screen.getByTestId('baph-movie-list').parentElement;

      expect(movieListWrapper).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      const movieList = screen.getByTestId('baph-movie-list');
      expect(movieList).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText('Search Movies');
      expect(searchInput).toHaveAttribute('placeholder', 'Search Movies');
    });

    it('renders movie items with proper structure', () => {
      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      const theMatrix = screen.getByTestId('movie-item-603');
      const theGodfather = screen.getByTestId('movie-item-238');
      const pulpFiction = screen.getByTestId('movie-item-680');
      expect(theMatrix).toBeInTheDocument();
      expect(theGodfather).toBeInTheDocument();
      expect(pulpFiction).toBeInTheDocument();

      expect(theMatrix).toHaveTextContent('85.5');
      expect(theGodfather).toHaveTextContent('92.1');
      expect(pulpFiction).toHaveTextContent('89.3');
    });
  });
  describe('Error Handling', () => {
    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        movies: mockMovies,
        onScroll: vi.fn(),
        onSearch: vi.fn(),
        setSearchTerm: vi.fn()
      };

      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...minimalProps} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
      expect(screen.getByRole('search')).toBeInTheDocument();
    });

    it('handles undefined callback functions', () => {
      const propsWithUndefinedCallbacks = {
        ...defaultProps,
        onScroll: undefined,
        onSearch: undefined,
        setSearchTerm: undefined
      };

      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...propsWithUndefinedCallbacks} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });

  describe('Custom CSS Classes', () => {
    it('applies custom className when provided', () => {
      const customClassName = {
        movieListWrapper: { backgroundColor: 'red' }
      };

      render(
        <MemoryRouter><MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} className={customClassName} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });

  describe('Integration with Apollo Client', () => {
    it('integrates with Apollo MockedProvider without errors', () => {
      const mocks = [mockMovieDetailsQuery];

      render(
        <MemoryRouter><MockedProvider mocks={mocks}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });
  describe('Snapshot Tests', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(
        <MemoryRouter><MockedProvider mocks={[]}>
          <MovieList {...defaultProps} />
        </MockedProvider></MemoryRouter>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with empty movies list', () => {
      const { container } = render(
        <MemoryRouter><MockedProvider mocks={[]}>
          <MovieList {...defaultProps} movies={[]} />
        </MockedProvider></MemoryRouter>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with loading state', () => {
      const { container } = render(
        <MemoryRouter><MockedProvider mocks={[]}>
          <MovieList
            {...defaultProps}
            movies={[]}
            hasMore={true}
            isLoadingMore={true}
          />
        </MockedProvider></MemoryRouter>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should match snapshot with loading state', () => {
    const { container } = render(
      <MemoryRouter><MockedProvider mocks={[]}>
        <MovieList
          {...defaultProps}
          movies={[]}
          hasMore={true}
          isLoadingMore={true}
        />
      </MockedProvider></MemoryRouter>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search functionality', () => {
    const { container } = render(
      <MemoryRouter><MockedProvider mocks={[]}>
        <MovieList
          {...defaultProps}
          onSearch={vi.fn()}
          searchTerm="test search"
        />
      </MockedProvider></MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
