import { List, Search } from '@collinlucke/phantomartist';
import { MovieListItem } from './MovieListItem';
import { useScreenSize } from '../../hooks/useScreenSize';
import { baphColorVariations } from '../../styling/baphTheme';
import { CSSObject } from '@emotion/react';

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  poster?: string;
};

type MovieData = {
  movies: Movie[] | null;
  searchTerm?: string;
  resultsCount?: number;
  totalMovieCount?: string;
  cursor?: string;
  endOfResults?: boolean;

  onSearch?: (searchTerm: string) => void;
  setSearchTerm?: (term: string) => void;
  openDeleteModal?: ({ id, title }: { id: string; title: string }) => void;
};

export const MovieList: React.FC<MovieData> = ({
  movies,
  searchTerm,
  totalMovieCount,

  onSearch,
  setSearchTerm
}) => {
  const screenSize = useScreenSize();

  const onSearchHandler = (searchTerm: string) => {
    onSearch?.(searchTerm);
  };

  const setSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e.target.value);
  };

  return (
    <div css={[baphStyles.movieListWrapper]} className="baph-movie-list">
      <Search
        onSearch={onSearchHandler}
        searchTerm={searchTerm}
        searchLabel="Search Movies"
        setSearchTerm={setSearchTermHandler}
        resultsCount={movies?.length}
        buttonSize={screenSize}
        inputSize={'small'}
        useSearchButton={false}
        totalResultsCount={totalMovieCount}
        className={{
          searchWrapper: baphStyles.searchWrapper,
          resultsText: baphStyles.resultsText,
          searchForm: baphStyles.searchForm
        }}
      />
      <div css={baphStyles.listWrapper}>
        {movies?.length ? (
          <div>
            <List>
              {/* {movies &&
                movies.map(mov => (
                  <MovieListItem
                    mov={mov}
                    key={mov.id}
                    openDeleteModal={openDeleteModal || (() => {})}
                  />
                ))} */}
            </List>
          </div>
        ) : (
          <div css={[baphStyles.noResults]}>
            <h2>Real sorry to tell you this, but...</h2>
            <div>No movies match your search</div>
            <MovieListItem
              movie={{
                _id: '1',
                posterUrl:
                  'https://image.tmdb.org/t/p/original/xeEw3eLeSFmJgXZzmF2Efww0q3s.jpg',
                winningPercentage: 99.99
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  searchForm: {
    justifyContent: 'end'
  },
  listWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '65vh',
    justifyContent: 'center'
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '30px',
    color: baphColorVariations.tertiary[50]
  },
  movieListWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    marginTop: '35px'
  },
  searchWrapper: {
    position: 'sticky' as const,
    backgroundColor: 'transparent',
    top: 0,
    maxWidth: 'fit-content'
  },
  resultsText: {
    color: baphColorVariations.tertiary[50]
  }
};
