import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from './queries';
import { MovieListItem } from './MovieListItem';
import { useState } from 'react';

type Movie = {
  id: string;
  title: string;
  year: number;
  rated: string;
};

type MovieData = {
  getAllMovies: Movie[];
};

export const MovieList: React.FC<Movie> = () => {
  const [movieData, setMovieData] = useState<MovieData>({ getAllMovies: [] });
  const { loading, error } = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 50 // TODO: Hard code until I get around to making a but
    },
    onCompleted: data => {
      console.log(data);
      setMovieData(data);
    }
  });

  // TODO: Rip out out this table... Make new one in PhantomArtist

  // TODO: Make error handling and loading states better
  return <>TODO: Make the thingy</>;
};
