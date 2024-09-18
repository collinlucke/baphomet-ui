import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MOVIE } from '../../api/queries';
import { UPDATE_MOVIE, ADD_MOVIE } from '../../api/mutations';
import { MovieEditorForm } from '../MovieEditor/MovieEditorForm';
import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { useParams } from 'react-router-dom';

type MovieProps = {
  id?: string;
  title?: string;
  year?: number;
  rated?: string;
  poster?: string;
  fullplot?: string;
};

type EditMoviePage = MovieProps & {
  clean?: boolean;
};

const cleanForm = {
  id: '',
  poster: undefined,
  rated: undefined,
  title: undefined,
  year: undefined,
  fullplot: ''
};

export const EditMoviePage: React.FC<EditMoviePage> = ({ clean }) => {
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
      year: Number(movie.year),
      rated: movie.rated,
      poster: movie.poster,
      fullplot: movie.fullplot
    },
    onCompleted: data => {
      console.log(data);
    }
  });

  const [updateMovie] = useMutation(UPDATE_MOVIE, {
    variables: {
      id: movie.id,
      title: movie.title,
      year: Number(movie.year),
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
    const { pathname } = location;
    const matchResult = pathname?.match(/\/[a-zA-Z0-9]+/);
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
