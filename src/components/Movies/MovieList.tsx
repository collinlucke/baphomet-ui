/** @jsxImportSource @emotion/react */
import { List, Search } from '@collinlucke/phantomartist';
import { MovieListItem } from './MovieListItem';
import { ChangeEvent, FormEventHandler } from 'react';

type Movie = {
  id: string;
  title?: string;
  releaseDate?: string;
  rated?: string;
  poster?: string;
};

type MovieData = {
  movieData: {
    allMovies: Movie[];
  };
  searchTerm?: string;
  resultsCount?: number;

  onSearch?: React.FormEventHandler<HTMLFormElement>;
  setSearchTerm?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const MovieList: React.FC<MovieData> = ({
  movieData,
  onSearch,
  searchTerm,
  setSearchTerm
}) => {
  const onSearchHandler: FormEventHandler<HTMLFormElement> = e => {
    onSearch?.(e);
  };

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e);
  };

  return (
    <List>
      <Search
        onSearch={onSearchHandler}
        searchTerm={searchTerm}
        searchLabel="Search Movies"
        setSearchTerm={setSearchTermHandler}
        resultsCount={movieData.allMovies.length}
      />
      {movieData.allMovies.length ? (
        movieData.allMovies.map(mov => <MovieListItem mov={mov} key={mov.id} />)
      ) : (
        <div css={[baphStyles.noResults]}>
          <h2>No Movies Match Your Search</h2>
          <div>Maybe you should go make one...</div>
        </div>
      )}
    </List>
  );
};

const baphStyles = {
  noResults: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '30px'
  }
};
