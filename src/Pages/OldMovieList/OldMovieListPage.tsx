import {
  useMutation,
  ApolloError,
  useReactiveVar,
  useLazyQuery,
  useQuery
} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CHECK_AUTH, GET_ALL_MOVIES } from '../../api/queries.ts';
import { DELETE_MOVIE } from '../../api/mutations.ts';
import { MovieList } from './OldMovieList.tsx';
import {
  Block,
  Button,
  ButtonGroup,
  InnerWidth,
  Modal,
  PAHooks
} from '@collinlucke/phantomartist';
import { useScreenSize } from '../../hooks/useScreenSize.ts';
import { useState, useEffect, ChangeEvent } from 'react';
import { CustomErrorTypes } from '../../types/CustomTypes.types.ts';
import {
  errorVar,
  showHeadingVar,
  scrollLimitVar,
  cursorVar,
  searchTermVar,
  endOfResultsVar,
  getAllMoviesQueryVar,
  totalMovieCountVar,
  isAuthenticatedVar,
  moviesListVar
} from '../../reactiveVars.ts';

export type MovieType = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  moviesList: MovieType[];
  totalMovieCount: string;
  searchTerm?: string | number;
};

export const MovieListPage = () => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const { useDebounce } = PAHooks;
  const [movieToDelete, setMovieToDelete] = useState({ id: '', title: '' });

  const error = useReactiveVar(errorVar);
  const moviesList = useReactiveVar(moviesListVar);
  const showHeading = useReactiveVar(showHeadingVar);
  const searchTerm = useReactiveVar(searchTermVar);
  const cursor = useReactiveVar(cursorVar);
  const endOfResults = useReactiveVar(endOfResultsVar);
  const limit = useReactiveVar(scrollLimitVar);
  const totalMovieCount = useReactiveVar(totalMovieCountVar);
  const baphToken = localStorage.getItem('baphomet-token') || null;

  useEffect(() => {
    if (!showHeading) showHeadingVar(true);
    if (error) errorVar(undefined);
    setMovieToDelete({ id: '', title: '' });
  }, []);

  useQuery(CHECK_AUTH, {
    variables: { token: baphToken },
    onCompleted: data => isAuthenticatedVar(data?.checkAuth.isValid)
  });

  const [getAllMovies] = useLazyQuery(GET_ALL_MOVIES, {
    variables: {
      limit,
      searchTerm,
      cursor,
      loadAction: 'scroll',
      endOfResults
    },
    onCompleted: data => {
      if (!data?.movieResults) return;
      const {
        newMovies,
        newTotalMovieCount,
        newCursor,
        loadAction,
        endOfResults
      } = data.movieResults;
      cursorVar(newCursor);
      endOfResultsVar(endOfResults);
      totalMovieCountVar(newTotalMovieCount);

      if (loadAction === 'scroll') {
        moviesListVar([...(moviesList || []), ...newMovies]);
      } else if (loadAction === 'search') {
        moviesListVar(newMovies);
      }
    }
  });

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    onCompleted: data => {
      if (data.deleteMovie) navigate(0);
    },
    onError: (error: ApolloError) =>
      errorVar(error as CustomErrorTypes | undefined)
  });

  useEffect(() => {
    getAllMoviesQueryVar(getAllMovies);
    getAllMovies({
      variables: { limit, searchTerm, cursor, loadAction: 'scroll' }
    });
  }, []);

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    document.getElementsByClassName('baph-scroll-wrapper')[0].scrollTop = 0;
    searchTermVar(value);
    debouncedSearchTermHandler();
  };

  const debouncedSearchTermHandler = useDebounce(() => {
    getAllMovies({
      variables: {
        limit,
        searchTerm: searchTermVar(),
        cursor: '',
        loadAction: 'search'
      }
    });
  }, 300);

  const openDeleteModal = ({ id, title }: { id: string; title: string }) => {
    setMovieToDelete({ id, title });
  };

  const deleteMovieHandler = () => {
    deleteMovie({ variables: { id: movieToDelete.id } });
  };

  const navigateToArena = () => {
    navigate('/arena');
  };

  return (
    <Block
      className={{ block: baphStyles.movieListBlock }}
      dataTestId="movie-list"
    >
      <InnerWidth>
        <div css={baphStyles.headingWrapper}>
          <h2>Here's a List of Movies</h2>
          <Button
            size={screenSize}
            onClick={navigateToArena}
            className={{ button: baphStyles.button }}
          >
            Fight!
          </Button>
        </div>
        <MovieList
          movies={moviesList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTermHandler}
          openDeleteModal={openDeleteModal}
          totalMovieCount={totalMovieCount}
          cursor={cursor}
          endOfResults={endOfResults}
        />
      </InnerWidth>

      {movieToDelete.id && !error && (
        <Modal
          onClose={() => setMovieToDelete({ id: '', title: '' })}
          isOpen={!!movieToDelete.id}
        >
          <h2>
            Are you sure you want to delete{' '}
            <span css={baphStyles.movieTitleToDelete}>
              {movieToDelete.title}
            </span>
            ?
          </h2>
          <ButtonGroup>
            <Button onClick={deleteMovieHandler}>Delete</Button>
            <Button
              kind="secondary"
              onClick={() => setMovieToDelete({ id: '', title: '' })}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Modal>
      )}
    </Block>
  );
};

const baphStyles = {
  modal: { backgroundColor: 'rgba(255,255,255,.75)' },
  movieTitleToDelete: { fontStyle: 'italic' },
  movieListBlock: { marginBottom: '20px' },
  button: { alignSelf: 'flex-end' },
  headingWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
};
