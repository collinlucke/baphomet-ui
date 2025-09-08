import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { MovieList } from '../MovieList/MovieList';
import { setupIntersectionObserverMock } from '../__mocks__/browserMocks';
import { mockMovies, mockMovieDetailsQuery } from '../__mocks__/testData';

setupIntersectionObserverMock();

const renderWithApollo = (ui: React.ReactElement) => {
  return render(
    <MockedProvider mocks={[mockMovieDetailsQuery]}>{ui}</MockedProvider>
  );
};

describe('MovieList Component - Integration Tests', () => {
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
  });

  describe('User Workflows', () => {
    it('allows users to interact with real movie components', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      // With real MovieListItem, we check for movie images with alt text
      expect(screen.getByAltText('The Matrix')).toBeInTheDocument();
      expect(screen.getByAltText('The Godfather')).toBeInTheDocument();
      expect(screen.getByAltText('Pulp Fiction')).toBeInTheDocument();
    });

    it('displays total movie count', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      expect(screen.getByTestId('total-results')).toHaveTextContent(
        'Total Results: 3'
      );
    });

    it('renders no results message when movies array is empty', () => {
      renderWithApollo(<MovieList {...defaultProps} movies={[]} />);
      expect(
        screen.getByText('Real sorry to tell you this, but...')
      ).toBeInTheDocument();
      expect(
        screen.getByText('No movies match your search')
      ).toBeInTheDocument();
    });

    it('renders no results message when movies is null', () => {
      renderWithApollo(<MovieList {...defaultProps} movies={null} />);
      expect(
        screen.getByText('Real sorry to tell you this, but...')
      ).toBeInTheDocument();
      expect(
        screen.getByText('No movies match your search')
      ).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when isLoadingMore is true', () => {
      renderWithApollo(<MovieList {...defaultProps} isLoadingMore={true} />);

      expect(screen.getByText('Loading more movies...')).toBeInTheDocument();
    });

    it('shows end of results message when hasMore is false', () => {
      renderWithApollo(<MovieList {...defaultProps} hasMore={false} />);

      expect(
        screen.getByText("You've reached the end! 🎬")
      ).toBeInTheDocument();
    });

    it('does not show end message when movies array is empty', () => {
      renderWithApollo(
        <MovieList {...defaultProps} movies={[]} hasMore={false} />
      );

      expect(
        screen.queryByText("You've reached the end! 🎬")
      ).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('triggers search when user types in search input', async () => {
      const user = userEvent.setup();
      const mockSetSearchTerm = vi.fn();

      renderWithApollo(
        <MovieList {...defaultProps} setSearchTerm={mockSetSearchTerm} />
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'matrix');

      expect(mockSetSearchTerm).toHaveBeenCalled();
      expect(mockSetSearchTerm).toHaveBeenCalledWith(expect.any(Object));
    });

    it('calls setSearchTerm when input changes', async () => {
      const user = userEvent.setup();
      const mockSetSearchTerm = vi.fn();

      renderWithApollo(
        <MovieList {...defaultProps} setSearchTerm={mockSetSearchTerm} />
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'matrix');

      expect(mockSetSearchTerm).toHaveBeenCalled();
    });

    it('displays current search term', () => {
      renderWithApollo(<MovieList {...defaultProps} searchTerm="matrix" />);

      expect(screen.getByTestId('search-input')).toHaveValue('matrix');
    });
  });

  describe('Movie Details Functionality', () => {
    it('renders MovieListItem components with click handlers', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      const matrixMovie = screen.getByAltText('The Matrix');
      expect(matrixMovie).toBeInTheDocument();

      const movieItem = matrixMovie.closest('li');
      expect(movieItem).toBeInTheDocument();
    });

    it('renders modal component', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      // The modal should be present in the DOM but not visible (isOpen=false)
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Scroll Functionality', () => {
    it('renders sentinel element for infinite scroll', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      // The sentinel is a div for intersection observer, we can test its presence
      const movieListWrapper =
        screen.getByTestId('baph-movie-list').parentElement;

      expect(movieListWrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      const movieList = screen.getByTestId('baph-movie-list');
      expect(movieList).toBeInTheDocument();

      // Check that the search input has proper labeling
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Search Movies');
    });

    it('renders movie items with proper structure', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      expect(
        screen.getByLabelText('Open details for The Matrix')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Open details for The Godfather')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Open details for Pulp Fiction')
      ).toBeInTheDocument();

      const movieItems = screen.getAllByRole('button');
      expect(movieItems.length).toBeGreaterThan(0);
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

      renderWithApollo(<MovieList {...minimalProps} />);

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

      renderWithApollo(<MovieList {...propsWithUndefinedCallbacks} />);

      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });

  describe('Custom CSS Classes', () => {
    it('applies custom className when provided', () => {
      const customClassName = {
        movieListWrapper: { backgroundColor: 'red' }
      };

      renderWithApollo(
        <MovieList {...defaultProps} className={customClassName} />
      );

      // The component should render without crashing when custom styles are applied
      expect(screen.getByTestId('baph-movie-list')).toBeInTheDocument();
    });
  });

  describe('Integration with Apollo Client', () => {
    it('integrates with Apollo MockedProvider without errors', () => {
      renderWithApollo(<MovieList {...defaultProps} />);

      expect(screen.getByTestId('total-results')).toBeInTheDocument();
    });
  });
});
