import { useEffect, useRef } from 'react';
import type { Movie } from '../../types/movies.types';
import { CSSObject } from '@emotion/react';
import { tokens, List, Search, Modal } from 'athameui';
import { MovieListItem } from './MovieListItem';

type MovieData = {
  movies: Movie[] | null;
  searchTerm?: string;
  totalMovieCount?: string;
  showSearch?: boolean;
  className?: CSSObject;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  sortBy?: 'winningPercentage' | 'title' | 'releaseDate';
  sx?: {
    list?: CSSObject;
  };

  onScroll?: () => void;
  onSearch?: (searchTerm: string | number | undefined) => void;
  setSearchTerm?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const MovieList = ({
  movies,
  searchTerm,
  totalMovieCount,
  showSearch = true,
  className,
  isLoadingMore = false,
  hasMore = true,
  sx,
  onScroll,
  onSearch,
  setSearchTerm
}: MovieData) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onSearchHandler = (searchTerm: string | number | undefined) => {
    onSearch?.(searchTerm);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoadingMore) {
          onScroll?.();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isLoadingMore]);

  const setSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e);
  };

  return (
    <>
      <div
        css={[baphStyles.movieListWrapper, className?.movieListWrapper]}
        data-testid="baph-movie-list"
      >
        {showSearch && (
          <Search
            onSearch={onSearchHandler}
            searchTerm={searchTerm}
            searchLabel="Search Movies"
            setSearchTerm={setSearchTermHandler}
            showSearchButton={false}
            totalResultsCount={totalMovieCount}
            testId="baph-search"
            className={{
              searchWrapper: baphStyles.searchWrapper,
              resultsText: baphStyles.resultsText,
              searchForm: baphStyles.searchForm
            }}
          />
        )}

        {movies?.length ? (
          <>
            <List
              sx={{ list: { ...baphStyles.list, ...sx?.list } }}
              data-testid="movie-list"
            >
              {movies &&
                movies.map(mov => <MovieListItem movie={mov} key={mov.id} />)}
            </List>
            {isLoadingMore && (
              <div css={baphStyles.loadingContainer}>
                <div css={baphStyles.loadingText}>Loading more movies...</div>
              </div>
            )}
            {!hasMore && movies.length > 0 && (
              <div css={baphStyles.endContainer}>
                <div css={baphStyles.endText}>You've reached the end! 🎬</div>
              </div>
            )}
          </>
        ) : (
          <div css={[baphStyles.noResults]}>
            <h2>Real sorry to tell you this, but...</h2>
            <div>No movies match your search</div>
          </div>
        )}
        <div ref={sentinelRef} css={baphStyles.sentinel} />
      </div>
      <Modal isOpen={false} onClose={() => {}} title="Movie Details">
        modal stuff
      </Modal>
    </>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  sentinel: {
    height: '1px',
    width: '100%',
    backgroundColor: 'transparent'
  },

  searchForm: {
    position: 'sticky',
    zIndex: 10,
    top: 0,
    padding: '35px 0',
    justifyContent: 'end',
    '&:after': {
      content: '""',
      display: 'block',
      width: '100vw',
      height: '-webkit-fill-available',
      position: 'absolute',
      top: 0,
      right: '50%',
      transform: 'translateX(50%)',

      zIndex: -1,
      backdropFilter: 'blur(50px)',
      WebkitBackdropFilter: 'blur(50px)'
    }
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '30px',
    color: tokens.color.tertiary.vibrant[500]
  },
  list: {
    display: 'grid',
    gap: '15px',
    listStyleType: 'none',
    paddingInlineStart: 0,
    margin: 0,
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    [tokens.media.min.xs]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '20px'
    },
    [tokens.media.min.md]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px'
    },
    [tokens.media.min.lg]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '25px'
    },
    [tokens.media.min.xl]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))'
    }
  },
  movieListWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%'
  },
  searchWrapper: {
    position: 'relative' as const,
    backgroundColor: 'transparent',
    top: 0,
    maxWidth: '1024px'
  },
  resultsText: {
    color: tokens.color.tertiary.vibrant[500]
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    marginTop: '2rem'
  },
  loadingText: {
    color: tokens.color.tertiary.vibrant[500],
    fontSize: '1.1rem',
    fontWeight: 'bold',
    opacity: 0.8,
    '@keyframes pulse': {
      '0%': { opacity: 0.4 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.4 }
    },
    animation: 'pulse 2s infinite'
  },
  endContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 2rem',
    marginTop: '2rem'
  },
  endText: {
    color: tokens.color.tertiary.vibrant[500],
    fontSize: '1.2rem',
    fontWeight: 'bold',
    opacity: 0.6,
    textAlign: 'center' as const
  }
};
