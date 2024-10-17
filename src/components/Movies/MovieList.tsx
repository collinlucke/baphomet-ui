/** @jsxImportSource @emotion/react */
import {
  Button,
  List,
  Search,
  useResizedWidth
} from '@collinlucke/phantomartist';
import { MovieListItem } from './MovieListItem';
import { ChangeEvent, FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

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
  useSearchButton?: boolean;

  onSearch?: React.FormEventHandler<HTMLFormElement>;
  setSearchTerm?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const MovieList: React.FC<MovieData> = ({
  movieData,
  searchTerm,
  useSearchButton,
  onSearch,
  setSearchTerm
}) => {
  const navigate = useNavigate();
  const width = useResizedWidth();

  const onSearchHandler: FormEventHandler<HTMLFormElement> = e => {
    onSearch?.(e);
  };

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e);
  };

  const navigateToArena = () => {
    navigate('/arena');
  };

  const buttonSize = () => {
    if (width <= 580) {
      return 'medium';
    }
    return 'large';
  };

  return (
    <List>
      <Search
        onSearch={onSearchHandler}
        searchTerm={searchTerm}
        searchLabel="Search Movies"
        setSearchTerm={setSearchTermHandler}
        resultsCount={movieData.allMovies.length}
        buttonSize={buttonSize()}
        inputSize={buttonSize()}
        useSearchButton={useSearchButton}
      />
      {movieData.allMovies.length ? (
        movieData.allMovies.map(mov => <MovieListItem mov={mov} key={mov.id} />)
      ) : (
        <div css={[baphStyles.noResults]}>
          <h2>No Movies Match Your Search</h2>
          <div>Maybe you should go make one...</div>
        </div>
      )}
      <Button
        size={buttonSize()}
        onClick={navigateToArena}
        className={baphStyles}
      >
        Fight!
      </Button>
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
  },
  buttons: {
    alignSelf: 'end',
    display: 'flex',
    flexDirection: 'column' as 'column'
  }
};
