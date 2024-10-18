import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MOVIE } from '../../api/queries';
import { UPDATE_MOVIE, ADD_MOVIE } from '../../api/mutations';
import { MovieEditorForm } from './MovieEditorForm';
import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(cleanForm);

  useEffect(() => {
    if (clean && JSON.stringify(movie) !== JSON.stringify(cleanForm)) {
      setMovie(cleanForm);
    }
  }, [clean]);

  useQuery(GET_MOVIE, {
    variables: {
      id
    },
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
    }
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const { name, value } = target;
    const newMovie = { ...movie, [name]: value };
    setMovie(newMovie);
  };
  const onChangeHandlerTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    const newMovie = { ...movie, [name]: value };
    setMovie(newMovie);
  };

  const onSubmitHandler = () => {
    const { hash } = location;
    const matchResult = hash?.match(/\/[a-zA-Z0-9]+/);
    const endPoint = matchResult?.[0];

    if (endPoint === '/create') {
      addMovie();
    } else if (endPoint === '/edit') {
      updateMovie();
    }
  };

  return (
    <>
      <Block>
        <InnerWidth>
          <MovieEditorForm
            readonly={readonly}
            clean={clean}
            movie={movie}
            onChange={onChangeHandler}
            onChangeTextArea={onChangeHandlerTextArea}
            onSubmit={onSubmitHandler}
          />
        </InnerWidth>
      </Block>
    </>
  );
};
