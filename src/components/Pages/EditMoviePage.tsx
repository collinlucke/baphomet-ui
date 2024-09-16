import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MOVIE } from '../../api/queries';
import { MovieEditorForm } from '../MovieEditor/MovieEditorForm';
import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { useParams } from 'react-router-dom';

type MovieProps = {
  id: string;
  title?: string;
  year?: number;
  rated?: string;
  poster?: string;
};

export const EditMoviePage = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieProps>({
    id: '',
    poster: undefined,
    rated: undefined,
    title: undefined,
    year: undefined
  });

  useQuery(GET_MOVIE, {
    variables: {
      id
    },
    onCompleted: data => {
      const { movie } = data;
      setMovie(movie);
    }
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const { name, value } = target;
    const newMovie = { ...movie, [name]: value };
    setMovie(newMovie);
  };

  return (
    <>
      <Block>
        <InnerWidth>
          <MovieEditorForm movie={movie} onChange={onChangeHandler} />
        </InnerWidth>
      </Block>
    </>
  );
};
