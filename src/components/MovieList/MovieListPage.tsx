import {
  useQuery,
  useMutation,
  ApolloError,
  useReactiveVar
} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_MOVIES } from '../../api/queries';
import { DELETE_MOVIE } from '../../api/mutations';
import { MovieList } from './MovieList';
import {
  Block,
  Button,
  ButtonGroup,
  InnerWidth,
  Modal
} from '@collinlucke/phantomartist';
import { ChangeEvent, useState, useEffect } from 'react';
import { CustomErrorTypes } from '../../CustomTypes.types';
import { errorVar, showHeadingVar } from '../../reactiveVars';

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
};

type MovieData = {
  allMovies: Movie[];
  searchTerm?: string;
};

export const MovieListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData>({ allMovies: [] });
  const [movieToDelete, setMovieToDelete] = useState({ id: '', title: '' });
  const [isReady, setIsReady] = useState(false);
  const error = useReactiveVar(errorVar);
  const showHeading = useReactiveVar(showHeadingVar);

  useEffect(() => {
    if (!showHeading) {
      showHeadingVar(true);
    }
    if (error) {
      errorVar(undefined);
    }
    setMovieToDelete({ id: '', title: '' });
  }, [showHeading, error]);

  useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 100, // TODO: Hard coded until I get around to making a thingy to put put in a custom value
      searchTerm
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    onCompleted: data => {
      setMovieData(data);
      setIsReady(true);
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

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMovieData({ allMovies: [] });
    setSearchTerm(value);
  };

  const openDeleteModal = ({ id, title }: { id: string; title: string }) => {
    setMovieToDelete({ id, title });
  };

  const deleteMovieHandler = () => {
    deleteMovie({ variables: { id: movieToDelete.id } });
    setMovieToDelete({ id: '', title: '' });
  };

  return (
    <>
      <Block dataTestId="movie-list">
        <InnerWidth>
          <h2 css={baphStyles.h2}>Here's a List of Movies</h2>
          {isReady && (
            <MovieList
              movieData={movieData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTermHandler}
              openDeleteModal={openDeleteModal}
            />
          )}
        </InnerWidth>
        {movieToDelete.id && !error && (
          <Modal
            className={baphStyles}
            closeModal={() => setMovieToDelete({ id: '', title: '' })}
          >
            <h2 css={baphStyles.h2}>
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
  h2: {
    marginBottom: '20px'
  },
  modal: {
    backgroundColor: `rgba(255,255,255,.75)`
  },
  movieTitleToDelete: {
    fontStyle: 'italic'
  }
};
