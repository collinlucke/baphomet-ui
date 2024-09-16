import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../../api/queries';
import { MovieList } from '../Movies/MovieList';
import { Block, InnerWidth } from '@collinlucke/phantomartist';

type Movie = {
  id: string;
  title?: string;
  year?: number;
  rated?: string;
};

type MovieData = {
  allMovies: Movie[];
};

export const MovieListPage = () => {
  const [movieData, setMovieData] = useState<MovieData>({ allMovies: [] });
  const {} = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 50 // TODO: Hard coded until I get around to making a thingy to put put in a custom value
    },
    onCompleted: data => {
      setMovieData(data);
    }
  });

  return (
    <>
      <Block>
        <InnerWidth>
          <MovieList movieData={movieData} />
        </InnerWidth>
      </Block>
    </>
  );
};
