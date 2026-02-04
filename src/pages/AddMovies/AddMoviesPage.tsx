import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useReactiveVar } from '@apollo/client/react';
import {
  isExistingMovieVar,
  currentMovieVar
} from './addMoviesPageReactiveVars';
import { Button, Search, Main, tokens } from 'athameui';
import { PageTitle } from '../../components/PageTitle';
import { MovieDetailsForm } from './MovieDetailsForm';
import { CSSObject } from '@emotion/react';
import { ADD_MOVIE, UPDATE_MOVIE } from '../../api/mutations';
import {
  GET_MOVIE_BY_TMDB_ID,
  FETCH_MOVIE_FROM_TMDB,
  FETCH_POSSIBLE_MOVIE_MATCHES
} from '../../api/queries';
import { PossibleMovieMatchesModal } from './PossibleMovieMatchesModal';

type PossibleMovieMatchResponse = {
  results: PossibleMovieMatch[];
  page: number;
  totalPages: number;
  totalResults: number;
};

type AddMovieData = {
  addMovie: CurrentMovie;
};

type UpdateMovieData = {
  updateMovie: CurrentMovie;
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

type Director = {
  id: number;
  name: string;
  profilePath: string;
  role: string;
};

type SearchTermType = string | number | undefined;

// type NewMovie = {
//   title: string;
//   releaseDate?: string;
//   genres?: string[];
//   overview?: string;
//   posterPath?: string;
//   backdropPath?: string;
//   tmdbId?: string;
//   revenue?: string;
//   tagline?: string;
//   topBilledCast?: Array<TopBilledCastMember>;
//   directors?: Array<Directors>;
// };

export type CurrentMovie = {
  id?: string | undefined;
  title?: string | undefined;
  releaseDate?: string | undefined;
  genres?: string[] | undefined;
  overview?: string | undefined;
  posterPath?: string | undefined;
  backdropPath?: string | undefined;
  tmdbId?: number | undefined;
  revenue?: string | undefined;
  tagline?: string | undefined;
  topBilledCast?: TopBilledCastMember[] | undefined;
  directors?: Director[] | undefined;
};

export type PossibleMovieMatch = {
  id: string;
  tmdbId: number;
  title: string;
  releaseDate: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
};

const AddMoviesPage = () => {
  const [tmdbId, setTmdbId] = useState<number | undefined>(undefined);
  const [searchByTitle, setSearchByTitle] = useState<string>('');
  const [showMovieModal, setShowMovieModal] = useState<boolean>(false);
  const [possibleMatches, setPossibleMatches] = useState<PossibleMovieMatch[]>(
    []
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFoundInDbMessage, setShowFoundInDbMessage] = useState(false);
  const isExistingMovie = useReactiveVar(isExistingMovieVar);
  const currentMovie = useReactiveVar(currentMovieVar);
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
  const fetchByTmdbIdHandler = async (tmdbId?: number | undefined) => {
    if (!tmdbId) return;
    setIsLoading(true);
    setShowFoundInDbMessage(false);

    try {
      const { data } = await fetchMovieFromTmdb({
        variables: { tmdbId: tmdbId }
      });
      if (data) {
        currentMovieVar({ ...currentMovie, ...data.fetchedMovie });
      }
    } catch (err) {
      console.error('Error fetching movie data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (isExistingMovie) {
      handleUpdateMovie();
    } else {
      addMovieHandler();
    }
  };

  const searchByTmdbIdHandler = async (tmdbId: number) => {
    if (!tmdbId) return;

    setIsLoading(true);
    try {
      const movieByTmdbIdResponse = await getMovieByTmdbId({
        variables: { tmdbId }
      });

      const { found, movie } = movieByTmdbIdResponse.data?.movieResult || {};
      console.log('Movie by TMDB ID response:', movieByTmdbIdResponse);
      if (found && movie) {
        currentMovieVar(movie);
        isExistingMovieVar(true);
        setShowFoundInDbMessage(true);
      }

      if (!found) {
        try {
          const data = await fetchMovieFromTmdb({ variables: { tmdbId } });
          console.log('Fetched movie from TMDB:', data);
          currentMovieVar(data.data?.fetchedMovie);
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
    setTmdbId(parseInt(e.target.value, 10));
  };

  const titleSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByTitle(e.target.value);
  };

  /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
  const searchByTitleHandler = async (title: SearchTermType) => {
    if (!title?.toString().trim()) return;
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
  /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

  const selectMovieHandler = async (tmdbId: number) => {
    setShowMovieModal(false);
    const movieByTmdbIdResponse = await getMovieByTmdbId({
      variables: { tmdbId }
    });
    const { found, movie } = movieByTmdbIdResponse.data?.movieResult || {};

    if (found && movie) {
      currentMovieVar(movie);
      isExistingMovieVar(true);
      setShowFoundInDbMessage(true);
      return;
    }
    if (!found) {
      try {
        const data = await fetchMovieFromTmdb({ variables: { tmdbId } });
        currentMovieVar(data.data?.fetchedMovie);
      } catch (error) {
        console.error('Error fetching movie from TMDB:', error);
      }
      return;
    }
  };

  const handleCloseModal = () => {
    setShowMovieModal(false);
    setPossibleMatches([]);
  };

  const clearFormHandler = () => {
    setTmdbId(undefined);
    setSearchByTitle('');
    setPossibleMatches([]);
    setShowFoundInDbMessage(false);
    currentMovieVar({
      id: '',
      title: '',
      releaseDate: '',
      genres: [],
      revenue: '',
      posterPath: '',
      backdropPath: '',
      tmdbId: undefined,
      overview: '',
      tagline: '',
      topBilledCast: [],
      directors: []
    });
  };

  const onFormFieldChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === 'genres') {
        currentMovieVar({
          ...currentMovie,
          [field]: value.split(',').map(s => s.trim())
        });
      } else {
        currentMovieVar({ ...currentMovie, [field]: value });
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
        const { __typename, ...directorRest } = director as Director & {
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

  const addMovieHandler = async () => {
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

  const removePerson = (id: number, roleType?: string | undefined): void => {
    console.log('Removing person with ID:', id, 'from', roleType);
    if (roleType === 'topBilledCast') {
      const updatedMovie = {
        ...currentMovie,
        topBilledCast:
          currentMovie?.topBilledCast &&
          currentMovie.topBilledCast.filter(
            (member: TopBilledCastMember): boolean => member.id !== id
          )
      };
      currentMovieVar(updatedMovie);
    } else {
      const updatedMovie = {
        ...currentMovie,
        directors:
          currentMovie?.directors &&
          currentMovie.directors.filter(
            (director: Director): boolean => director.id !== id
          )
      };
      currentMovieVar(updatedMovie);
    }
  };

  return (
    <>
      <Main>
        <PageTitle title="Add Movies" />
        <div
          css={baphStyles.formContainer}
          className="baph-add-movies-form-container"
        >
          <Search
            searchTerm={searchByTitle}
            searchLabel="Enter movie title"
            setSearchTerm={titleSearchTermHandler}
            onSearch={searchByTitleHandler}
            inputSize="medium"
            buttonSize="medium"
            buttonVariant="tertiary"
            showResultsCount={false}
            label="Movie Title"
            buttonText={isSearching ? 'Searching...' : 'Search by Title'}
            dark
          />

          <Search
            searchTerm={tmdbId}
            searchLabel="Enter TMDB ID"
            setSearchTerm={handleSearchIdChange}
            onSearch={searchByTitleHandler}
            inputSize="medium"
            buttonSize="medium"
            buttonVariant="tertiary"
            showResultsCount={false}
            label="TMDB ID"
            buttonText={`Fetch By TMDB ID`}
            dark
          />
          {showFoundInDbMessage && (
            <div css={baphStyles.messageContainer}>
              {`${currentMovie?.title} found in database and loaded for editing. Would you like to refetch the latest data from TMDB?`}
              <Button
                size="small"
                variant="secondary"
                onClick={() => {
                  fetchByTmdbIdHandler(currentMovie?.tmdbId);
                }}
              >
                Refetch from TMDB
              </Button>
            </div>
          )}

          <hr css={baphStyles.divider} />
          <MovieDetailsForm
            onFormFieldChange={onFormFieldChange}
            onSubmit={onSubmit}
            currentMovie={currentMovie}
            removePerson={removePerson}
            directorsLabel={directorsLabel}
            isExistingMovie={isExistingMovie}
            updateMovie={handleUpdateMovie}
            addMovie={addMovieHandler}
            isLoading={isLoading}
            clearFormHandler={clearFormHandler}
            searchByTmdbIdHandler={searchByTmdbIdHandler}
          />
        </div>
      </Main>
      <PossibleMovieMatchesModal
        possibleMatches={possibleMatches}
        selectMovieHandler={selectMovieHandler}
        showModal={showMovieModal}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};

export default AddMoviesPage;

const baphStyles: { [key: string]: CSSObject } = {
  successMessage: {
    color: tokens.color.secondary.vibrant[700]
  },
  errorMessage: {
    color: tokens.color.error.vibrant[700]
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
    [tokens.media.min.md]: {
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
    backgroundColor: tokens.color.secondary[500],
    border: `1px solid ${tokens.color.tertiary[600]}`,
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
    backgroundColor: tokens.color.secondary[500],
    border: `1px solid ${tokens.color.tertiary[600]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [tokens.media.max.md]: {
      width: '100%'
    }
  },
  divider: {
    borderTop: `1px solid ${tokens.color.tertiary[500]}`,
    width: '100%'
  }
};
