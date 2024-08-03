import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MOVIE } from '../../api/queries';
import { MovieEditorForm } from '../MovieEditor/MovieEditorForm';
import { Block, InnerWidth } from '@crazy-overlord/phantomartist';
import { useParams } from 'react-router-dom';

type MovieProps = {
  getMovie: {
    id: string;
    title?: string;
    year?: number;
    rated?: string;
    poster?: string;
  };
};

export const EditMoviePage = () => {
  const { id } = useParams();

  const [movieData, setMovieData] = useState<MovieProps>({
    getMovie: {
      id: '',
      poster: undefined,
      rated: undefined,
      title: undefined,
      year: undefined
    }
  });

  useQuery(GET_MOVIE, {
    variables: {
      id
    },
    onCompleted: data => {
      console.log(data);
      setMovieData(data);
    }
  });

  return (
    <>
      <Block>
        <InnerWidth>
          <MovieEditorForm movieData={movieData} />
        </InnerWidth>
      </Block>
    </>
  );
};
