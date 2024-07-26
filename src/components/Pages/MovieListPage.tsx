import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_MOVIES, GET_MOVIE } from '../../api/queries';
import { MovieList } from '../Movies/MovieList';
import { Block, InnerWidth } from '@crazy-overlord/phantomartist';
import * as stylex from '@stylexjs/stylex';

type Movie = {
  id: string;
  title?: string;
  year?: number;
  rated?: string;
};

type MovieData = {
  getAllMovies: Movie[];
};

export const MovieListPage = () => {
  const [movieData, setMovieData] = useState<MovieData>({ getAllMovies: [] });

  const { loading, error } = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 50 // TODO: Hard coded until I get around to making a thingy to put put in a custom value
    },
    onCompleted: data => {
      setMovieData(data);
    }
  });

  return (
    <>
      <Block className={MovieListPageStyles.block}>
        <InnerWidth className={MovieListPageStyles.inner}>
          <MovieList movieData={movieData} />
        </InnerWidth>
      </Block>
      <div style={{ height: '400px', backgroundColor: 'pink' }}></div>
    </>
  );
};

const MovieListPageStyles = stylex.create({
  block: {
    backgroundColor: 'pink'
  },
  inner: {
    backgroundColor: 'aqua'
  }
});
