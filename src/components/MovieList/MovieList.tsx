import { List, Search } from '@collinlucke/phantomartist';
import { MovieListItem } from './MovieListItem';
import { baphColorVariations } from '../../styling/baphTheme';
import { CSSObject } from '@emotion/react';

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  posterUrl?: string;
  winningPercentage: number;
  overview?: string;
  genres?: string[];
  revenue?: number;
  backdropUrl?: string;
  tmdbId?: number;
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
  // openDeleteModal?: ({ id, title }: { id: string; title: string }) => void;
};

export const MovieList: React.FC<MovieData> = ({
  movies,
  searchTerm,
  totalMovieCount,

  onSearch,
  setSearchTerm
}) => {
  const onSearchHandler = (searchTerm: string) => {
    onSearch?.(searchTerm);
  };

  const setSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e.target.value);
  };

  return (
    <div css={baphStyles.movieListWrapper} className="baph-movie-list">
      <Search
        onSearch={onSearchHandler}
        searchTerm={searchTerm}
        searchLabel="Search Movies"
        setSearchTerm={setSearchTermHandler}
        resultsCount={movies?.length}
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
          <List className={{ ui: baphStyles.ul }} date-testid="movie-list">
            {movies &&
              movies.map(mov => (
                <MovieListItem
                  movie={mov}
                  key={mov.id}
                  // openDeleteModal={openDeleteModal || (() => {})}
                />
              ))}
          </List>
        ) : (
          <div css={[baphStyles.noResults]}>
            <h2>Real sorry to tell you this, but...</h2>
            <div>No movies match your search</div>
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
    width: '100%',
    marginTop: '30px'
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '30px',
    color: baphColorVariations.tertiary[50]
  },
  ul: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '35px',
    listStyleType: 'none',
    paddingInlineStart: 0,
    margin: 0,
    width: '100%',
    justifyContent: 'center'
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
    top: 0
  },
  resultsText: {
    color: baphColorVariations.tertiary[50]
  }
};
