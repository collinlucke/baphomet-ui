import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useReactiveVar } from '@apollo/client/react';
import {
  isExistingMovieVar,
  currentMovieVar
} from './addMoviesPageReactiveVars';
import { Button, Search, Main, tokens } from 'athameui';
import { PageTitle } from '../../components/PageTitle';
import { AddMovieForm } from './AddMovieForm';
import { CSSObject } from '@emotion/react';
import { ADD_MOVIE, UPDATE_MOVIE } from '../../api/mutations';
import {
  GET_MOVIE_BY_TMDB_ID,
  FETCH_MOVIE_FROM_TMDB,
  FETCH_POSSIBLE_MOVIE_MATCHES
} from '../../api/queries';
import { PossibleMovieMatchesModal } from './PossibleMovieMatchesModal';
import type { Genre } from '../../types/movies.types';

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

type CastCredit = {
  personId: number;
  character?: string;
  order?: number;
  name?: string;
  profilePath?: string;
  __typename?: string;
};

type CrewCredit = {
  personId: number;
  job?: string;
  department?: string;
  name?: string;
  profilePath?: string;
  __typename?: string;
};

type SearchTermType = string | number | undefined;

export type CurrentMovie = {
  id?: string | undefined;
  title?: string | undefined;
  releaseDate?: string | undefined;
  mpaRating?: string | undefined;
  genres?: Genre[] | undefined;
  overview?: string | undefined;
  posterPath?: string | undefined;
  backdropPath?: string | undefined;
  tmdbId?: number | string | undefined;
  imdbId?: string;
  originalTitle?: string;
  originalLanguage?: string;
  homepage?: string;
  status?: string;
  runtime?: number | null;
  budget?: number | null;
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
  adult?: boolean;
  spokenLanguages?: string[];
  productionCompanies?: string[];
  productionCountries?: string[];
  originCountries?: string[];
  keywords?: string[];
  logoPath?: string;
  posterPaths?: string[];
  backdropPaths?: string[];
  certifications?: { country?: string; rating?: string; releaseDate?: string }[];
  videos?: {
    name?: string;
    site?: string;
    key?: string;
    type?: string;
    official?: boolean;
  }[];
  revenue?: number | string | undefined;
  tagline?: string | undefined;
  cast?: CastCredit[] | undefined;
  crew?: CrewCredit[] | undefined;
};

export type PossibleMovieMatch = {
  id: string;
  tmdbId: string;
  title: string;
  releaseDate: string;
  mpaRating: string;
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
  const fetchByTmdbIdHandler = async (tmdbId?: string | undefined) => {
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

  const searchByTmdbIdHandler = async (tmdbId: string) => {
    if (!tmdbId) return;

    setIsLoading(true);
    try {
      const movieByTmdbIdResponse = await getMovieByTmdbId({
        variables: { tmdbId }
      });

      const { found, movie } = movieByTmdbIdResponse.data?.movieResult || {};
      if (found && movie) {
        currentMovieVar(movie);
        isExistingMovieVar(true);
        setShowFoundInDbMessage(true);
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
    } catch (error) {
      console.error('Error searching for movie:', error);
    }
  };

  const titleSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByTitle(e.target.value);
  };

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

  const selectMovieHandler = async (tmdbId: string) => {
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
      cast: [],
      crew: []
    });
  };

  const onFormFieldChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === 'genres') {
        const names = value
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const previous = currentMovie?.genres ?? [];
        currentMovieVar({
          ...currentMovie,
          [field]: names.map(name => {
            const existing = previous.find(g => g.genre === name);
            return existing ?? { id: name, genre: name };
          })
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

    if (rest.cast) {
      rest.cast = rest.cast.map(({ personId, character, order }) => ({
        personId,
        character,
        order
      }));
    }

    if (rest.crew) {
      rest.crew = rest.crew.map(({ personId, job, department }) => ({
        personId,
        job,
        department
      }));
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
        revenue:
          currentMovie.revenue == null || currentMovie.revenue === ''
            ? null
            : Number(currentMovie.revenue),
        posterPath: currentMovie.posterPath,
        backdropPath: currentMovie.backdropPath,
        tmdbId:
          currentMovie.tmdbId == null ? undefined : String(currentMovie.tmdbId),
        imdbId: currentMovie.imdbId,
        originalTitle: currentMovie.originalTitle,
        originalLanguage: currentMovie.originalLanguage,
        homepage: currentMovie.homepage,
        status: currentMovie.status,
        runtime: currentMovie.runtime,
        budget: currentMovie.budget,
        popularity: currentMovie.popularity,
        voteAverage: currentMovie.voteAverage,
        voteCount: currentMovie.voteCount,
        adult: currentMovie.adult,
        mpaRating: currentMovie.mpaRating,
        spokenLanguages: currentMovie.spokenLanguages,
        productionCompanies: currentMovie.productionCompanies,
        productionCountries: currentMovie.productionCountries,
        originCountries: currentMovie.originCountries,
        keywords: currentMovie.keywords,
        logoPath: currentMovie.logoPath,
        posterPaths: currentMovie.posterPaths,
        backdropPaths: currentMovie.backdropPaths,
        certifications: currentMovie.certifications,
        videos: currentMovie.videos,
        tagline: currentMovie.tagline,
        cast: currentMovie.cast?.map(({ personId, character, order }) => ({
          personId,
          character,
          order
        })),
        crew: currentMovie.crew?.map(({ personId, job, department }) => ({
          personId,
          job,
          department
        })),
        ...additionalData
      }
    });
  };
  const directors =
    currentMovie?.crew?.filter(person => person.job === 'Director') ?? [];
  const directorsLabel = directors.length === 1 ? 'Director' : 'Directors';

  const removePerson = (id: number, personType?: string | undefined): void => {
    if (personType === 'CastCredit') {
      currentMovieVar({
        ...currentMovie,
        cast: currentMovie?.cast?.filter(member => member.personId !== id)
      });
    }
    if (personType === 'CrewCredit') {
      currentMovieVar({
        ...currentMovie,
        crew: currentMovie?.crew?.filter(
          member => !(member.personId === id && member.job === 'Director')
        )
      });
    }
  };

  return (
    <>
      <Main sx={{ mainContent: baphStyles.mainNarrowContent }}>
        <PageTitle title="Add Movies" />
        <div
          css={baphStyles.formContainer}
          data-testid="baph-add-movies-form-container"
        >
          <Search
            id="search-by-title"
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
            id="search-by-tmdb-id"
            searchTerm={tmdbId}
            searchLabel="Enter TMDB ID"
            setSearchTerm={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTmdbId(parseInt(e.target.value))
            }
            onSearch={() => searchByTmdbIdHandler(tmdbId?.toString() || '')}
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
                  fetchByTmdbIdHandler(currentMovie?.tmdbId?.toString());
                }}
              >
                Refetch from TMDB
              </Button>
            </div>
          )}

          <hr css={baphStyles.divider} />
          <AddMovieForm
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
  mainNarrowContent: {
    maxWidth: '768px'
  },
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
    gap: '1rem',
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
