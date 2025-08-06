import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { getMovieByTMDBId, getMoviesByTitle } from '../../api/tmdbApi';
import {
  Button,
  InputField,
  Search,
  Modal,
  baseColors as paColors,
  baseVibrantColors,
  mediaQueries
} from '@collinlucke/phantomartist';
import { AboveTheFold } from '../../components/AboveTheFold';
import { CSSObject } from '@emotion/react';
import { ADD_MOVIE } from '../../api/mutations';
import { CHECK_MOVIE_BY_TMDB_ID } from '../../api/queries';

type NewMovie = {
  title: string;
  releaseDate?: string;
  genres?: string[];
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  tmdbId?: string;
  revenue?: string;
};

type TMDBGenre = {
  id: number;
  name: string;
};

type TMDBMovieResult = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
};

type TMDBSearchResponse = {
  page: number;
  results: TMDBMovieResult[];
  total_pages: number;
  total_results: number;
};

export const AddMoviesPage: React.FC = () => {
  const [tmdbId, setTmdbId] = useState<string>('');
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showMovieModal, setShowMovieModal] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TMDBMovieResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');
  const [duplicateError, setDuplicateError] = useState<string>('');
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    releaseDate: '',
    genres: [],
    revenue: '',
    posterUrl: '',
    backdropUrl: '',
    tmdbId: '',
    overview: ''
  });
  const additionalData = {
    addedBy: JSON.parse(localStorage.getItem('baphomet-user') || '{}').id,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    totalWins: 0,
    totalLosses: 0,
    winningPercentage: 0.0,
    totalComparisons: 0
  };

  const [addMovieMutation, { loading: isLoading }] = useMutation(ADD_MOVIE, {
    onCompleted: data => {
      console.log('Movie added successfully:', data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    },
    onError: error => {
      console.error('Error adding movie:', error);
    }
  });

  const [checkMovieByTmdbId] = useLazyQuery(CHECK_MOVIE_BY_TMDB_ID, {
    onCompleted: data => {
      const { searchResults } = data?.movieResults || {};
      console.log('Duplicate check result:', data);
      console.log('Duplicate check result:', searchResults);
      // If movies are found with this TMDB ID, prevent adding
      if (searchResults && searchResults.length > 0) {
        setDuplicateError(
          `Ope! "${searchResults[0].title}" has already been added`
        );
        setTimeout(() => setDuplicateError(''), 3000); // Clear error after 3 seconds
        return;
      } else {
        // If no duplicates are found, proceed to add the movie
        addMovieMutation({
          variables: {
            ...newMovie,
            ...additionalData
          }
        });
      }
    },
    onError: error => {
      console.error("Checking for duplicates didn't work.", error);
      setDuplicateError('Failed to check for duplicates. Please try again.');
    }
  });

  const handleFetch = async (tmdbId?: string) => {
    const idToFetch = tmdbId || newMovie.tmdbId;
    if (!idToFetch) return;
    try {
      const data = await getMovieByTMDBId(idToFetch);

      setNewMovie({
        ...newMovie,
        title: data.title || '',
        releaseDate: data.release_date || '',
        // directors: [], // Directors are fetched from TMDB's credits endpoint
        genres: data.genres?.map((genre: TMDBGenre) => genre.name) || [],
        revenue: data.revenue ? `$${data.revenue.toLocaleString()} USD` : '',
        overview: data.overview || '',
        posterUrl: data.poster_path
          ? `https://image.tmdb.org/t/p/original${data.poster_path}`
          : '',
        backdropUrl: data.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
          : '',
        tmdbId: idToFetch
      });
    } catch (err) {
      console.error('Error fetching TMDB movie data:', err);
    }
  };

  const handleSearch = (tmdbId: string) => {
    if (tmdbId) {
      handleFetch(tmdbId);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmdbId(e.target.value);
  };

  const handleTitleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleSearch(e.target.value);
  };

  const handleTitleSearch = async (title: string) => {
    if (!title.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const response: TMDBSearchResponse = await getMoviesByTitle(title);
      if (response.results && response.results.length > 0) {
        setSearchResults(response.results);
        setShowMovieModal(true);
      } else {
        setSearchError(
          'No movies found with that title. Try a different search term.'
        );
      }
    } catch (error) {
      console.error('Error searching for movies:', error);
      setSearchError('Failed to search for movies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = async (movie: TMDBMovieResult) => {
    setShowMovieModal(false);
    await handleFetch(movie.id.toString());
  };

  const handleCloseModal = () => {
    setShowMovieModal(false);
    setSearchResults([]);
    setSearchError('');
  };

  const handleClear = () => {
    setTmdbId('');
    setTitleSearch('');
    setSearchResults([]);
    setSearchError('');
    setDuplicateError('');
    setNewMovie({
      title: '',
      releaseDate: '',
      genres: [],
      revenue: '',
      posterUrl: '',
      backdropUrl: '',
      tmdbId: '',
      overview: ''
    });
  };

  const handleChange =
    (field: keyof NewMovie) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === 'genres') {
        setNewMovie({
          ...newMovie,
          [field]: value.split(',').map(s => s.trim())
        });
      } else {
        setNewMovie({ ...newMovie, [field]: value });
      }
    };

  const handleAddMovie = async () => {
    await checkMovieByTmdbId({
      variables: { tmdbId: newMovie.tmdbId }
    });
  };

  return (
    <AboveTheFold>
      <h1>Add Movies</h1>
      {(showSuccess || duplicateError) && (
        <div css={baphStyles.messageContainer}>
          {showSuccess && (
            <h4 css={baphStyles.successMessage}>Movie added successfully!</h4>
          )}
          {duplicateError && (
            <h4 css={baphStyles.errorMessage}>{`${duplicateError}`}</h4>
          )}
        </div>
      )}
      <div
        css={baphStyles.formContainer}
        className="baph-add-movies-form-container"
      >
        <Search
          searchTerm={titleSearch}
          searchLabel="Enter movie title"
          setSearchTerm={handleTitleSearchChange}
          onSearch={handleTitleSearch}
          inputSize="medium"
          buttonSize="medium"
          buttonKind="secondary"
          showResultsCount={false}
          label="Movie Title"
          buttonText={isSearching ? 'Searching...' : 'Search by Title'}
          onDark
        />

        {searchError && <div css={baphStyles.errorMessage}>{searchError}</div>}

        <Search
          searchTerm={tmdbId}
          searchLabel="Enter TMDB ID"
          setSearchTerm={handleSearchTermChange}
          onSearch={handleSearch}
          inputSize="medium"
          buttonSize="medium"
          buttonKind="secondary"
          showResultsCount={false}
          label="TMDB ID"
          buttonText={`Fetch By TMDB ID`}
          onDark
        />

        <hr css={baphStyles.divider} />

        <div css={baphStyles.formFieldContainers}>
          <InputField
            label="Title"
            type="text"
            value={newMovie.title}
            onChange={handleChange('title')}
            placeholder="Movie Title"
            size="medium"
            onDark
          />
          <InputField
            size="medium"
            label="Release Date"
            type="text"
            value={newMovie.releaseDate || ''}
            onChange={handleChange('releaseDate')}
            placeholder="Release Date"
            onDark
          />
          <InputField
            size="medium"
            label="Genres"
            type="text"
            value={newMovie.genres?.join(', ') || ''}
            onChange={handleChange('genres')}
            placeholder="Genres, comma-separated"
            onDark
          />
          <InputField
            size="medium"
            label="Overview"
            type="text"
            value={newMovie.overview || ''}
            onChange={handleChange('overview')}
            placeholder="Overview"
            onDark
          />
          <InputField
            size="medium"
            label="Revenue"
            type="text"
            value={newMovie.revenue || ''}
            onChange={handleChange('revenue')}
            placeholder="Revenue"
            onDark
          />
          <InputField
            size="medium"
            label="Poster URL"
            type="text"
            value={newMovie.posterUrl || ''}
            onChange={handleChange('posterUrl')}
            placeholder="URL to poster image"
            onDark
          />
          <InputField
            size="medium"
            label="Backdrop URL"
            type="text"
            value={newMovie.backdropUrl || ''}
            onChange={handleChange('backdropUrl')}
            placeholder="URL to backdrop image"
            onDark
          />
        </div>

        <div css={baphStyles.previewContainer}>
          {newMovie.posterUrl ? (
            <img
              css={baphStyles.posterImg}
              src={newMovie.posterUrl}
              alt="Poster Preview"
            />
          ) : (
            <div css={baphStyles.posterImg}>No Poster Available</div>
          )}
          {newMovie.backdropUrl ? (
            <img
              css={baphStyles.backdropImg}
              src={newMovie.backdropUrl}
              alt="Backdrop Preview"
            />
          ) : (
            <div css={baphStyles.backdropImg}>No Backdrop Available</div>
          )}
        </div>
      </div>

      <div css={baphStyles.saveButtonGroup}>
        <Button
          size="small"
          kind="secondary"
          onClick={handleAddMovie}
          disabled={isLoading || !newMovie.title}
        >
          {isLoading ? 'Adding...' : 'Add Movie'}
        </Button>
        <Button size="medium" kind="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Movie Search Results Modal */}
      <Modal
        isOpen={showMovieModal}
        onClose={handleCloseModal}
        title="Search Results"
        maxWidth="800px"
        dataTestId="movie-search-modal"
      >
        <div css={baphStyles.modalContent}>
          <p css={baphStyles.modalDescription}>
            Found {searchResults.length} movie
            {searchResults.length !== 1 ? 's' : ''}. Click "Select Movie" to use
            one of these results.
          </p>

          <div css={baphStyles.movieResults}>
            {searchResults.map(movie => (
              <div key={movie.id} css={baphStyles.movieResultItem}>
                <div css={baphStyles.moviePoster}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      css={baphStyles.posterImage}
                    />
                  ) : (
                    <div css={baphStyles.noPosterPlaceholder}>No Poster</div>
                  )}
                </div>

                <div css={baphStyles.movieDetails}>
                  <h3 css={baphStyles.movieTitle}>{movie.title}</h3>

                  <div css={baphStyles.movieMeta}>
                    <div css={baphStyles.metaItem}>
                      <strong>Release Date:</strong>{' '}
                      {movie.release_date || 'Unknown'}
                    </div>
                    <div css={baphStyles.metaItem}>
                      <strong>TMDB ID:</strong> {movie.id}
                    </div>
                    <div css={baphStyles.metaItem}>
                      <strong>Rating:</strong> ⭐{' '}
                      {movie.vote_average?.toFixed(1) || 'N/A'}(
                      {movie.vote_count || 0} votes)
                    </div>
                  </div>

                  <p css={baphStyles.movieOverview}>
                    {movie.overview || 'No overview available.'}
                  </p>

                  <Button
                    kind="primary"
                    size="small"
                    onClick={() => handleSelectMovie(movie)}
                    className={{ button: baphStyles.selectButton }}
                  >
                    Select Movie
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </AboveTheFold>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  successMessage: {
    color: baseVibrantColors.secondary[700]
  },
  errorMessage: {
    color: baseVibrantColors.accent[700]
  },
  formFieldContainers: {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column'
  },
  saveButtonGroup: {
    display: 'flex',
    position: 'fixed',
    gap: '1rem',
    alignSelf: 'end',
    marginBottom: '50px'
  },
  formContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    flexDirection: 'column' as const
  },
  previewContainer: {
    gap: '2rem',
    display: 'flex',
    width: '100%',
    maxWidth: '800px', // Add max width to prevent overflow
    flexDirection: 'column' as const,
    alignItems: 'center',
    [mediaQueries.minWidth.md]: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start'
    }
  },
  posterImg: {
    maxHeight: '300px',
    aspectRatio: '2/3',
    width: '200px', // Set explicit width
    borderRadius: '4px',
    objectFit: 'cover' as const,
    backgroundColor: paColors.secondary[500],
    border: `1px solid ${paColors.tertiary[600]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdropImg: {
    maxHeight: '300px',
    aspectRatio: '16/9',
    width: 'calc(100% - 232px)', // Subtract poster width + gap
    minWidth: '0', // Allow shrinking
    borderRadius: '4px',
    objectFit: 'cover' as const,
    backgroundColor: paColors.secondary[500],
    border: `1px solid ${paColors.tertiary[600]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [mediaQueries.maxWidth.md]: {
      width: '100%' // Full width on mobile
    }
  },

  // Modal styles
  modalContent: {
    maxHeight: '70vh',
    overflowY: 'auto' as const
  },
  modalDescription: {
    color: paColors.primary[500],
    marginBottom: '20px',
    fontSize: '16px',
    textAlign: 'center' as const
  },
  movieResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  movieResultItem: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: paColors.secondary[700],
    border: `1px solid ${paColors.tertiary[600]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: paColors.secondary[600],
      borderColor: paColors.tertiary[500],
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }
  },
  moviePoster: {
    flexShrink: 0,
    width: '80px',
    height: '120px',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  posterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  noPosterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: paColors.secondary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: paColors.tertiary[400],
    fontSize: '12px',
    textAlign: 'center' as const,
    border: `1px solid ${paColors.tertiary[500]}`
  },
  movieDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  movieTitle: {
    margin: 0,
    color: baseVibrantColors.primary[300],
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.3'
  },
  movieMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
    fontSize: '14px'
  },
  metaItem: {
    color: paColors.tertiary[300],
    '& strong': {
      color: paColors.tertiary[100],
      marginRight: '5px'
    }
  },
  movieOverview: {
    color: paColors.tertiary[200],
    fontSize: '14px',
    lineHeight: '1.4',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  selectButton: {
    alignSelf: 'flex-start',
    marginTop: '10px'
  },
  divider: {
    borderTop: `1px solid ${paColors.tertiary[500]}`,
    width: '100%'
  }
};
