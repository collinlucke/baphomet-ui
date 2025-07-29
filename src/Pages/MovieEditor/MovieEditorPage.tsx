import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MOVIE } from '../../api/queries';
import { UPDATE_MOVIE, ADD_MOVIE } from '../../api/mutations';
import { MovieEditorForm } from './MovieEditorForm';
import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomErrorTypes } from '../../types/CustomTypes.types.ts';
import { errorVar, showHeadingVar } from '../../reactiveVars';

type MovieProps = {
  id?: string;
  title?: string;
  releaseDate?: string;
  rated?: string;
  poster?: string;
  fullplot?: string;
};

type EditMoviePage = MovieProps & {
  clean?: boolean;
  readonly?: boolean;
};

const cleanForm = {
  id: '',
  poster: undefined,
  rated: undefined,
  title: undefined,
  releaseDate: undefined,
  fullplot: ''
};

export const MovieEditorPage: React.FC<EditMoviePage> = ({
  clean,
  readonly
}) => {
  const [movie, setMovie] = useState(cleanForm);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (clean && JSON.stringify(movie) !== JSON.stringify(cleanForm)) {
      setMovie(cleanForm);
    }
    showHeadingVar(true);
  }, [clean]);

  useQuery(GET_MOVIE, {
    variables: {
      id
    },
    skip: clean,
    onCompleted: data => {
      setMovie(data.movie);
    }
  });

  const [addMovie] = useMutation(ADD_MOVIE, {
    variables: {
      title: movie.title,
      releaseDate: movie.releaseDate,
      rated: movie.rated,
      poster: movie.poster,
      fullplot: movie.fullplot
    },
    onCompleted: data => {
      navigate(`/view/${data.newMovie.id}`);
    },
    onError: error => {
      errorVar(error as CustomErrorTypes);
    }
  });

  const [updateMovie] = useMutation(UPDATE_MOVIE, {
    variables: {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.releaseDate,
      rated: movie.rated,
      poster: movie.poster,
      fullplot: movie.fullplot
    },
    onCompleted: data => {
      setMovie(data.updatedMovie);
    },
    onError: error => {
      errorVar(error as CustomErrorTypes);
    }
  });

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    const newMovie = { ...movie, [name]: value };
    setMovie(newMovie);
  };
  const onChangeHandlerTextArea = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    const newMovie = { ...movie, [name]: value };
    setMovie(newMovie);
  };

  const onSubmitHandler = () => {
    const matchResult = location.pathname?.match(/\/[a-zA-Z0-9]+/);
    const endPoint = matchResult?.[0];

    if (endPoint === '/create') {
      addMovie();
    } else if (endPoint === '/edit') {
      updateMovie();
    }
  };

  return (
    <>
      {(movie.title || clean) && (
        <Block dataTestId="movie-editor-form">
          <InnerWidth>
            <MovieEditorForm
              readonly={readonly}
              movie={movie}
              onChange={onChangeHandler}
              onChangeTextArea={onChangeHandlerTextArea}
              onSubmit={onSubmitHandler}
            />
          </InnerWidth>
        </Block>
      )}
    </>
  );
};
