import {
  useMutation,
  ApolloError,
  useReactiveVar,
  useLazyQuery,
  useQuery
} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CHECK_AUTH, GET_ALL_MOVIES } from '../../api/queries';
import { DELETE_MOVIE } from '../../api/mutations';
import { MovieList } from './MovieList';
import {
  Block,
  Button,
  ButtonGroup,
  InnerWidth,
  Modal
} from '@collinlucke/phantomartist';
import { useScreenSize } from '../../hooks/useScreenSize';
import { ChangeEvent, useState, useEffect } from 'react';
import { CustomErrorTypes } from '../../CustomTypes.types';
import {
  errorVar,
  showHeadingVar,
  scrollLimitVar,
  cursorVar,
  searchTermVar,
  endOfResultsVar,
  getAllMoviesQueryVar,
  totalMovieCountVar,
  isAuthenticatedVar
} from '../../reactiveVars';
import { debounce } from '../../helpers/debounce';

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  movies: Movie[];
  totalMovieCount: string;
  searchTerm?: string;
};

export const MovieListPage = () => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const [loadAction] = useState('scroll');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieToDelete, setMovieToDelete] = useState({ id: '', title: '' });
  const error = useReactiveVar(errorVar);
  const showHeading = useReactiveVar(showHeadingVar);
  const searchTerm = useReactiveVar(searchTermVar);
  const cursor = useReactiveVar(cursorVar);
  const endOfResults = useReactiveVar(endOfResultsVar);
  const limit = useReactiveVar(scrollLimitVar);
  const totalMovieCount = useReactiveVar(totalMovieCountVar);
  const baphToken = localStorage.getItem('baphomet-token') || null;

  useEffect(() => {
    if (!showHeading) {
      showHeadingVar(true);
    }
    if (error) {
      errorVar(undefined);
    }
    setMovieToDelete({ id: '', title: '' });
  }, []);

  useQuery(CHECK_AUTH, {
    variables: {
      token: baphToken
    },
    onCompleted: data => {
      isAuthenticatedVar(data?.checkAuth.isValid);
    }
  });

  const [getAllMovies] = useLazyQuery(GET_ALL_MOVIES, {
    variables: {
      limit,
      searchTerm,
      cursor,
      loadAction,
      endOfResults
    },
    onCompleted: data => {
      const {
        newMovies,
        newTotalMovieCount,
        newCursor,
        loadAction,
        endOfResults
      } = data?.movieResults;
      cursorVar(newCursor);
      endOfResultsVar(endOfResults);
      totalMovieCountVar(newTotalMovieCount);

      if (loadAction === 'scroll') {
        setMovies(() => [...movies, ...newMovies]);
      } else if (loadAction === 'search') {
        setMovies(() => newMovies);
      }
    }
  });

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    onCompleted: data => {
      if (data.deleteMovie) {
        navigate(0);
      }
    },
    onError: (error: ApolloError) => {
      errorVar(error as CustomErrorTypes | undefined);
    }
  });

  useEffect(() => {
    getAllMoviesQueryVar(getAllMovies);
    getAllMovies({ variables: { limit, searchTerm, cursor, loadAction } });
  }, []);

  const setSearchTermHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    searchTermVar(value);
    debouncedSearchTermHandler();
  };

  const debouncedSearchTermHandler = debounce(() => {
    const searchTerm = searchTermVar();
    getAllMovies({
      variables: {
        limit,
        searchTerm,
        cursor: '',
        loadAction: 'search'
      }
    });
  }, 500);

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
    <>
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
            movies={movies}
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
            className={baphStyles}
            closeModal={() => setMovieToDelete({ id: '', title: '' })}
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
    </>
  );
};

const baphStyles = {
  modal: {
    backgroundColor: `rgba(255,255,255,.75)`
  },
  movieTitleToDelete: {
    fontStyle: 'italic'
  },
  movieListBlock: {
    marginBottom: '20px'
  },
  button: {
    alignSelf: 'flex-end'
  },
  headingWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
};
