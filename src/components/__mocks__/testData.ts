import { GET_MOVIE_BY_TMDB_ID } from '../../api/queries';

/**
 * Shared mock data for MovieList tests
 */
export const mockMovies = [
  {
    id: '1',
    title: 'The Matrix',
    releaseDate: '1999-03-31',
    posterUrl: 'https://example.com/matrix-poster.jpg',
    winningPercentage: 85.5,
    overview: 'A computer programmer discovers reality is a simulation.',
    genres: ['Action', 'Sci-Fi'],
    revenue: 463517383,
    backdropUrl: 'https://example.com/matrix-backdrop.jpg',
    tmdbId: '603'
  },
  {
    id: '2',
    title: 'The Godfather',
    releaseDate: '1972-03-24',
    posterUrl: 'https://example.com/godfather-poster.jpg',
    winningPercentage: 92.1,
    overview: 'The patriarch of an organized crime dynasty transfers control.',
    genres: ['Crime', 'Drama'],
    revenue: 246120974,
    backdropUrl: 'https://example.com/godfather-backdrop.jpg',
    tmdbId: '238'
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    releaseDate: '1994-10-14',
    posterUrl: 'https://example.com/pulpfiction-poster.jpg',
    winningPercentage: 89.3,
    overview: 'The lives of two mob hitmen, a boxer, and others intertwine.',
    genres: ['Crime', 'Drama'],
    revenue: 214179088,
    backdropUrl: 'https://example.com/pulpfiction-backdrop.jpg',
    tmdbId: '680'
  }
];

export const mockMovieDetailsQuery = {
  request: {
    query: GET_MOVIE_BY_TMDB_ID,
    variables: { tmdbId: '603' }
  },
  result: {
    data: {
      movieResults: {
        id: '1',
        title: 'The Matrix',
        overview: 'A computer programmer discovers reality is a simulation.',
        releaseDate: '1999-03-31',
        posterUrl: 'https://example.com/matrix-poster.jpg',
        backdropUrl: 'https://example.com/matrix-backdrop.jpg',
        winningPercentage: 85.5,
        genres: ['Action', 'Sci-Fi'],
        revenue: 463517383,
        tmdbId: 603
      }
    }
  }
};

export const defaultMovieListProps = {
  movies: mockMovies,
  searchTerm: '',
  totalMovieCount: '3',
  showSearch: true,
  isLoadingMore: false,
  hasMore: true,
  onScroll: () => {},
  onSearch: () => {},
  setSearchTerm: () => {}
};
