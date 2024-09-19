import { ChangeEvent, useState } from 'react';
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
  searchTerm?: string;
  onSearch?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setSearchTerm?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const MovieListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [movieData, setMovieData] = useState<MovieData>({ allMovies: [] });

  const [preventQuery, setPreventQuery] = useState(false);

  const {} = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 100, // TODO: Hard coded until I get around to making a thingy to put put in a custom value
      searchTerm
    },
    skip: preventQuery,
    onCompleted: data => {
      setMovieData(data);
      setPreventQuery(true);
    }
  });

  const searchMoviesHandler: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setPreventQuery(false);
  };

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  return (
    <>
      <Block>
        <InnerWidth>
          <MovieList
            movieData={movieData}
            onSearch={searchMoviesHandler}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTermHandler}
          />
        </InnerWidth>
      </Block>
    </>
  );
};
