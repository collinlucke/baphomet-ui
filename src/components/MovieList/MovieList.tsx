import { ChangeEvent, FormEventHandler } from 'react';
import { List, Search } from '@collinlucke/phantomartist';
import { MovieListItem } from './MovieListItem';
import { useScreenSize } from '../../hooks/useScreenSize';
import { CSSObject } from '@emotion/react';

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  poster?: string;
};

type MovieData = {
  movies: Movie[];
  searchTerm?: string;
  resultsCount?: number;
  totalMovieCount?: string;
  cursor?: string;
  endOfResults?: boolean;

  onSearch?: React.FormEventHandler<HTMLFormElement>;
  setSearchTerm?: (e: ChangeEvent<HTMLInputElement>) => void;
  openDeleteModal?: ({ id, title }: { id: string; title: string }) => void;
};

export const MovieList: React.FC<MovieData> = ({
  movies,
  searchTerm,
  totalMovieCount,
  onSearch,
  setSearchTerm,
  openDeleteModal
}) => {
  const screenSize = useScreenSize();

  const onSearchHandler: FormEventHandler<HTMLFormElement> = e => {
    onSearch?.(e);
  };

  const setSearchTermHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm?.(e);
  };

  return (
    <div css={[baphStyles.movieListWrapper]}>
      <Search
        onSearch={onSearchHandler}
        searchTerm={searchTerm}
        searchLabel="Search Movies"
        setSearchTerm={setSearchTermHandler}
        resultsCount={movies?.length}
        buttonSize={screenSize}
        inputSize={screenSize}
        useSearchButton={false}
        totalResultsCount={totalMovieCount}
        className={{ searchWrapper: baphStyles.searchWrapper }}
      />
      <div>
        {movies ? (
          <div>
            <List>
              {movies &&
                movies.map(mov => (
                  <MovieListItem
                    mov={mov}
                    key={mov.id}
                    openDeleteModal={openDeleteModal || (() => {})}
                  />
                ))}
            </List>
          </div>
        ) : (
          <div css={[baphStyles.noResults]}>
            <h2>No Movies Match Your Search</h2>
            <div>Maybe you should go make one...</div>
          </div>
        )}
      </div>
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  noResults: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '30px'
  },
  movieListWrapper: {
    width: 'fill-available'
  },
  searchWrapper: {
    position: 'sticky' as const,
    top: 0
  }
};
