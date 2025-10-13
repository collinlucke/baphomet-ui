import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import {
  Button,
  InputField,
  Search,
  baseColors,
  baseVibrantColors,
  mediaQueries,
  Label
} from 'phantomartist';
import { BodySection } from '../../components/BodySection';
import { CSSObject } from '@emotion/react';
import { ADD_MOVIE, UPDATE_MOVIE } from '../../api/mutations';
import {
  GET_MOVIE_BY_TMDB_ID,
  FETCH_MOVIE_FROM_TMDB,
  FETCH_POSSIBLE_MOVIE_MATCHES
} from '../../api/queries';
import { PersonCardCarousel } from '../../components/PersonCard/PersonCardCarousel';
import { PossibleMovieMatchesModal } from './PossibleMovieMatchesModal';

type PossibleMovieMatchResponse = {
  results: PossibleMovieMatch[];
  page: number;
  totalPages: number;
  totalResults: number;
};

type MovieResponse = {
  success: boolean;
  message: string;
  movie: CurrentMovie;
};

type AddMovieData = {
  addMovie: MovieResponse;
};

type UpdateMovieData = {
  updateMovie: MovieResponse;
};

type ExistingMovieData = {
  movieResult: {
    found: boolean;
    errorMessage: string;
    movie: CurrentMovie | undefined;
  };
};

type TopBilledCastMember = {
  id: number;
  name: string;
  role: string;
  profilePath: string;
};

type Directors = {
  id: number;
  name: string;
  profilePath: string;
  role: string;
};

type NewMovie = {
  title: string;
  releaseDate?: string;
  genres?: string[];
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  tmdbId?: string;
  revenue?: string;
  tagline?: string;
  topBilledCast?: Array<TopBilledCastMember>;
  directors?: Array<Directors>;
};

type CurrentMovie = {
  id?: string | undefined;
  title?: string | undefined;
  releaseDate?: string | undefined;
  genres?: string[] | undefined;
  overview?: string | undefined;
  posterPath?: string | undefined;
  backdropPath?: string | undefined;
  tmdbId?: string | undefined;
  revenue?: string | undefined;
  tagline?: string | undefined;
  topBilledCast?: Array<TopBilledCastMember> | undefined;
  directors?: Array<Directors> | undefined;
};

export type PossibleMovieMatch = {
  id: string;
  title: string;
  releaseDate: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
};

export const AddMoviesPage: React.FC = () => {
  const [tmdbId, setTmdbId] = useState<string>('');
  const [searchByTitle, setSearchByTitle] = useState<string>('');
  const [showMovieModal, setShowMovieModal] = useState<boolean>(false);
  const [possibleMatches, setPossibleMatches] = useState<PossibleMovieMatch[]>(
    []
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFoundInDbMessage, setShowFoundInDbMessage] = useState(false);
  const [isExistingMovie, setIsExistingMovie] = useState<boolean>(false);

  const [currentMovie, setCurrentMovie] = useState<CurrentMovie | undefined>(
    undefined
  );
  const additionalData = {
    addedBy: JSON.parse(localStorage.getItem('baphomet-user') || '{}').id,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    totalWins: 0,
    totalLosses: 0,
    winningPercentage: 0.0,
    totalComparisons: 0
  };

  // ----- MUTATIONS & QUERIES ----- //
  const [addMovie] = useMutation<AddMovieData>(ADD_MOVIE);

  const [updateMovie] = useMutation<UpdateMovieData>(UPDATE_MOVIE);

  const [getMovieByTmdbId] =
    useLazyQuery<ExistingMovieData>(GET_MOVIE_BY_TMDB_ID);

  const [fetchMovieFromTmdb] = useLazyQuery<{
    fetchedMovie: CurrentMovie;
  }>(FETCH_MOVIE_FROM_TMDB);

  const [fetchPossibleMovieMatches] = useLazyQuery<{
    possibleMovieMatches: PossibleMovieMatchResponse;
  }>(FETCH_POSSIBLE_MOVIE_MATCHES);

  // ----- HANDLERS ----- //
  const handleFetchByTmdbId = async (tmdbId?: string) => {
    if (!tmdbId) return;
    setIsLoading(true);
    setShowFoundInDbMessage(false);

    try {
      const { data } = await fetchMovieFromTmdb({
        variables: { tmdbId: tmdbId }
      });
      if (data) {
        setCurrentMovie(prev => {
          return { ...prev, ...data.fetchedMovie };
        });
      }
    } catch (err) {
      console.error('Error fetching movie data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByTmdbId = async (tmdbId: string) => {
    if (!tmdbId) return;

    setIsLoading(true);
    try {
      const movieByTmdbIdResponse = await getMovieByTmdbId({
        variables: { tmdbId }
      });
      const { found, movie } = movieByTmdbIdResponse.data?.movieResult || {};
      if (found) {
        setCurrentMovie(movie);
        setIsExistingMovie(true);
        setShowFoundInDbMessage(true);
      }

      if (!found) {
        try {
          await handleFetchByTmdbId(tmdbId);
        } catch (error) {
          console.error('Error fetching movie from TMDB:', error);
        }
        return;
      }
    } catch (error) {
      console.error('Error searching for movie:', error);
    }
  };
  const handleSearchIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmdbId(e.target.value);
  };

  const handleTitleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByTitle(e.target.value);
  };

  const handleTitleSearch = async (title: string) => {
    if (!title.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetchPossibleMovieMatches({
        variables: { title }
      });
      const results = response?.data?.possibleMovieMatches?.results || [];

      if (results && results.length > 0) {
        setPossibleMatches(results);
        setShowMovieModal(true);
      }
    } catch (error) {
      console.error('Error searching for movies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = async (tmdbId: string) => {
    setShowMovieModal(false);
    await handleSearchByTmdbId(tmdbId);
  };

  const handleCloseModal = () => {
    setShowMovieModal(false);
    setPossibleMatches([]);
  };

  const handleClear = () => {
    setTmdbId('');
    setSearchByTitle('');
    setPossibleMatches([]);
    setShowFoundInDbMessage(false);
    setCurrentMovie({
      id: '',
      title: '',
      releaseDate: '',
      genres: [],
      revenue: '',
      posterPath: '',
      backdropPath: '',
      tmdbId: '',
      overview: '',
      tagline: '',
      topBilledCast: [],
      directors: []
    });
  };

  const handleChange =
    (field: keyof NewMovie) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === 'genres') {
        setCurrentMovie({
          ...currentMovie,
          [field]: value.split(',').map(s => s.trim())
        });
      } else {
        setCurrentMovie({ ...currentMovie, [field]: value });
      }
    };

  const handleUpdateMovie = async () => {
    if (!currentMovie) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...rest } = currentMovie as CurrentMovie & {
      __typename: string;
    };

    if (rest.topBilledCast) {
      rest.topBilledCast = rest.topBilledCast.map(cast => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __typename, ...castRest } = cast as TopBilledCastMember & {
          __typename: string;
        };
        return castRest;
      });
    }

    if (rest?.directors) {
      rest.directors = rest.directors.map(director => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __typename, ...directorRest } = director as Directors & {
          __typename: string;
        };
        return directorRest;
      });
    }

    const updateData = {
      ...rest,
      lastUpdated: new Date().toISOString()
    };

    updateMovie({ variables: updateData });
  };

  const handleAddMovie = async () => {
    if (!currentMovie) return;
    await addMovie({
      variables: {
        title: currentMovie.title,
        releaseDate: currentMovie.releaseDate,
        overview: currentMovie.overview,
        genres: currentMovie.genres,
        revenue: currentMovie.revenue,
        posterPath: currentMovie.posterPath,
        backdropPath: currentMovie.backdropPath,
        tmdbId: currentMovie.tmdbId,
        tagline: currentMovie.tagline,
        topBilledCast: currentMovie.topBilledCast?.map(cast => ({
          id: cast.id,
          name: cast.name,
          profilePath: cast.profilePath,
          role: cast.role
        })),
        directors: currentMovie.directors?.map(director => ({
          id: director.id,
          name: director.name,
          profilePath: director.profilePath,
          role: 'Director'
        })),
        ...additionalData
      }
    });
  };

  const directorsLabel =
    currentMovie?.directors && currentMovie.directors.length === 1
      ? 'Director'
      : 'Directors';

  const removePerson = (id: number, roleType?: string) => {
    if (roleType === 'topBilledCast') {
      setCurrentMovie(prev => ({
        ...prev,
        topBilledCast:
          prev?.topBilledCast &&
          prev.topBilledCast.filter(member => member.id !== id)
      }));
    } else {
      setCurrentMovie(prev => ({
        ...prev,
        directors:
          prev?.directors &&
          prev.directors.filter(director => director.id !== id)
      }));
    }
  };

  const SaveButtonGroup = () => (
    <div css={baphStyles.saveButtonGroup}>
      <Button
        size="small"
        variant="secondary"
        onClick={isExistingMovie ? handleUpdateMovie : handleAddMovie}
        disabled={isLoading || !currentMovie?.title}
      >
        {isLoading
          ? 'Loading...'
          : isExistingMovie
          ? 'Update Movie'
          : 'Add Movie'}
      </Button>
      {isExistingMovie && (
        <Button
          size="small"
          variant="secondary"
          onClick={() => handleFetchByTmdbId(currentMovie?.tmdbId)}
          disabled={isLoading}
        >
          Refetch from TMDB
        </Button>
      )}
      <Button size="medium" variant="outline" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );

  return (
    <>
      <BodySection>
        <h1>Add Movies</h1>
        <div
          css={baphStyles.formContainer}
          className="baph-add-movies-form-container"
        >
          <Search
            searchTerm={searchByTitle}
            searchLabel="Enter movie title"
            setSearchTerm={handleTitleSearchChange}
            onSearch={handleTitleSearch}
            inputSize="medium"
            buttonSize="medium"
            buttonVariant="secondary"
            showResultsCount={false}
            label="Movie Title"
            buttonText={isSearching ? 'Searching...' : 'Search by Title'}
            onDark
          />

          <Search
            searchTerm={tmdbId}
            searchLabel="Enter TMDB ID"
            setSearchTerm={handleSearchIdChange}
            onSearch={handleSearchByTmdbId}
            inputSize="medium"
            buttonSize="medium"
            buttonVariant="secondary"
            showResultsCount={false}
            label="TMDB ID"
            buttonText={`Fetch By TMDB ID`}
            onDark
          />
          {showFoundInDbMessage && (
            <div css={baphStyles.messageContainer}>
              {`${currentMovie?.title} found in database and loaded for editing. Would you like to refetch the latest data from TMDB?`}
              <Button
                size="small"
                variant="secondary"
                onClick={() => {
                  handleFetchByTmdbId(currentMovie?.tmdbId);
                }}
              >
                Refetch from TMDB
              </Button>
            </div>
          )}

          <SaveButtonGroup />
          <hr css={baphStyles.divider} />

          <div css={baphStyles.formFieldContainers}>
            <InputField
              label="Title"
              type="text"
              value={currentMovie?.title || ''}
              onChange={handleChange('title')}
              placeholder="Movie Title"
              size="medium"
              onDark
            />
            <InputField
              size="medium"
              label="Release Date"
              type="text"
              value={currentMovie?.releaseDate ?? ''}
              onChange={handleChange('releaseDate')}
              placeholder="Release Date"
              onDark
            />
            <InputField
              size="medium"
              label="Genres"
              type="text"
              value={currentMovie?.genres?.join(', ') ?? ''}
              onChange={handleChange('genres')}
              placeholder="Genres, comma-separated"
              onDark
            />
            <InputField
              size="medium"
              label="Overview"
              type="text"
              value={currentMovie?.overview ?? ''}
              onChange={handleChange('overview')}
              placeholder="Overview"
              onDark
            />
            <InputField
              size="medium"
              label="Revenue"
              type="text"
              value={currentMovie?.revenue ?? ''}
              onChange={handleChange('revenue')}
              placeholder="Revenue"
              onDark
            />
            <InputField
              size="medium"
              label="Poster Path"
              type="text"
              value={currentMovie?.posterPath ?? ''}
              onChange={handleChange('posterPath')}
              placeholder="Poster image path"
              onDark
            />
            <InputField
              size="medium"
              label="Backdrop Path"
              type="text"
              value={currentMovie?.backdropPath ?? ''}
              onChange={handleChange('backdropPath')}
              placeholder="Backdrop image path"
              onDark
            />
            <InputField
              size="medium"
              label="Tagline"
              type="text"
              value={currentMovie?.tagline ?? ''}
              onChange={handleChange('tagline')}
              placeholder="Tagline"
              onDark
            />
            <div>
              <Label label={directorsLabel} onDark />
              <PersonCardCarousel
                people={currentMovie?.directors || []}
                removePerson={removePerson}
                roleType="Director"
              />
            </div>
            <div>
              <Label label="Top Billed Cast" onDark />
              <PersonCardCarousel
                people={currentMovie?.topBilledCast || []}
                removePerson={removePerson}
                roleType="character"
              />
            </div>
          </div>

          <div css={baphStyles.previewContainer}>
            {currentMovie?.posterPath ? (
              <img
                css={baphStyles.posterImg}
                src={`https://image.tmdb.org/t/p/w300${currentMovie?.posterPath}`}
                alt="Poster Preview"
              />
            ) : (
              <div css={baphStyles.posterImg}>No Poster Available</div>
            )}
            {currentMovie?.backdropPath ? (
              <img
                css={baphStyles.backdropImg}
                src={`https://image.tmdb.org/t/p/w1280${currentMovie?.backdropPath}`}
                alt="Backdrop Preview"
              />
            ) : (
              <div css={baphStyles.backdropImg}>No Backdrop Available</div>
            )}
          </div>
        </div>

        <SaveButtonGroup />
      </BodySection>
      <PossibleMovieMatchesModal
        possibleMatches={possibleMatches}
        handleSelectMovie={handleSelectMovie}
        showModal={showMovieModal}
        handleCloseModal={handleCloseModal}
      />
    </>
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
    gap: '1rem',
    alignSelf: 'end'
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
    maxWidth: '800px',
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
    width: '200px',
    borderRadius: '4px',
    objectFit: 'cover' as const,
    backgroundColor: baseColors.secondary[500],
    border: `1px solid ${baseColors.tertiary[600]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdropImg: {
    maxHeight: '300px',
    aspectRatio: '16/9',
    width: 'calc(100% - 232px)',
    minWidth: '0',
    borderRadius: '4px',
    objectFit: 'cover' as const,
    backgroundColor: baseColors.secondary[500],
    border: `1px solid ${baseColors.tertiary[600]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [mediaQueries.maxWidth.md]: {
      width: '100%'
    }
  },
  divider: {
    borderTop: `1px solid ${baseColors.tertiary[500]}`,
    width: '100%'
  }
};
