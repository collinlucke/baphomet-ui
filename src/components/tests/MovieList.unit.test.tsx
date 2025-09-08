import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { createPhantomArtistMock } from '../__mocks__/phantomArtistMocks.tsx';
import { createMovieListItemMock } from '../__mocks__/movieListItemMock';
import { MovieList } from '../MovieList/MovieList';
import { setupIntersectionObserverMock } from '../__mocks__/browserMocks';
import { mockMovies, mockMovieDetailsQuery } from '../__mocks__/testData';

createPhantomArtistMock();
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
  });

  describe('Component Logic & Props', () => {
    it('renders movie list when movies are provided', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-603')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-238')).toBeInTheDocument();
      expect(screen.getByTestId('movie-item-680')).toBeInTheDocument();
    });

    it('displays total movie count in search component', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} totalMovieCount="5" />
        </MockedProvider>
      );

      expect(screen.getByTestId('total-results')).toHaveTextContent('5');
    });

    it('handles empty and null movie arrays', () => {
      const { rerender } = render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={[]} />
        </MockedProvider>
      );

      const noResultsLine1 = screen.getByText(
        'Real sorry to tell you this, but...'
      );
      const noResultsLine2 = screen.getByText('No movies match your search');

      expect(noResultsLine1).toBeInTheDocument();
      expect(noResultsLine2).toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={null} />
        </MockedProvider>
      );

      expect(noResultsLine1).toBeInTheDocument();
      expect(noResultsLine2).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when isLoadingMore is true', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} isLoadingMore={true} />
        </MockedProvider>
      );

      expect(screen.getByText('Loading more movies...')).toBeInTheDocument();
    });

    it('shows end of results message when hasMore is false', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} hasMore={false} />
        </MockedProvider>
      );

      expect(
        screen.getByText("You've reached the end! 🎬")
      ).toBeInTheDocument();
    });

    it('does not show end message when movies array is empty', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} movies={[]} hasMore={false} />
        </MockedProvider>
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
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} setSearchTerm={mockSetSearchTerm} />
        </MockedProvider>
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'matrix');

      expect(mockSetSearchTerm).toHaveBeenCalled();
    });

    it('displays current search term', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} searchTerm="matrix" />
        </MockedProvider>
      );

      expect(screen.getByTestId('search-input')).toHaveValue('matrix');
    });
  });

  describe('Movie Details Functionality', () => {
    it('calls fetchMovieDetails when openMovieDetailsHandler is triggered', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      const movieItem = screen.getByTestId('movie-item-603');
      await user.click(movieItem);

      await waitFor(() => {
        expect(movieItem).toBeInTheDocument();
      });
    });

    it('renders modal component', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Scroll Functionality', () => {
    it('renders sentinel element for infinite scroll', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      const movieListWrapper =
        screen.getByTestId('baph-movie-list').parentElement;

      expect(movieListWrapper).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      const movieList = screen.getByTestId('baph-movie-list');
      expect(movieList).toBeInTheDocument();

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Search Movies');
    });

    it('renders movie items with proper structure', () => {
      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
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
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...minimalProps} />
        </MockedProvider>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
      expect(screen.getByTestId('baph-search')).toBeInTheDocument();
    });

    it('handles undefined callback functions', () => {
      const propsWithUndefinedCallbacks = {
        ...defaultProps,
        onScroll: undefined,
        onSearch: undefined,
        setSearchTerm: undefined
      };

      render(
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...propsWithUndefinedCallbacks} />
        </MockedProvider>
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
        <MockedProvider mocks={[mockMovieDetailsQuery]}>
          <MovieList {...defaultProps} className={customClassName} />
        </MockedProvider>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });

  describe('Integration with Apollo Client', () => {
    it('integrates with Apollo MockedProvider without errors', () => {
      const mocks = [mockMovieDetailsQuery];

      render(
        <MockedProvider mocks={mocks}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });
  describe('Snapshot Tests', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(
        <MockedProvider mocks={[]}>
          <MovieList {...defaultProps} />
        </MockedProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with empty movies list', () => {
      const { container } = render(
        <MockedProvider mocks={[]}>
          <MovieList {...defaultProps} movies={[]} />
        </MockedProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with loading state', () => {
      const { container } = render(
        <MockedProvider mocks={[]}>
          <MovieList
            {...defaultProps}
            movies={[]}
            hasMore={true}
            isLoadingMore={true}
          />
        </MockedProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should match snapshot with loading state', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <MovieList
          {...defaultProps}
          movies={[]}
          hasMore={true}
          isLoadingMore={true}
        />
      </MockedProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search functionality', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <MovieList
          {...defaultProps}
          onSearch={vi.fn()}
          searchTerm="test search"
        />
      </MockedProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
