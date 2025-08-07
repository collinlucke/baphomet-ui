import { useState, useEffect, useRef } from 'react';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import {
  baphSemanticColors,
  baphTypography,
  baphColors
} from '../../styling/baphTheme';
import { AboveTheFold } from '../../components/AboveTheFold';
import { CSSObject } from '@emotion/react';
import { useLazyQuery } from '@apollo/client';

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

export const AllMoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursor, setCursor] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const isNewSearchRef = useRef(true);

  const [fetchMovies] = useLazyQuery(GET_MOVIES_BY_TITLE, {
    onCompleted: data => {
      console.log('Movies fetched:', data);
      const { searchResults, newCursor, endOfResults, newTotalMovieCount } =
        data.movieResults;

      // Update total count
      setTotalMovieCount(newTotalMovieCount || 0);

      // Use ref to get the current state and avoid closure issues
      if (isNewSearchRef.current) {
        console.log('Setting new movie list (new search)');
        setAllMovies(searchResults || []);
        isNewSearchRef.current = false; // Reset flag after handling new search
        setIsNewSearch(false);
      } else {
        console.log('Appending to existing movie list (lazy load)');
        setAllMovies(prev => {
          const incoming = searchResults || [];
          const existingIds = new Set(prev.map(m => m.id));
          const filtered = incoming.filter(
            (m: Movie) => !existingIds.has(m.id)
          );
          return [...prev, ...filtered];
        });
      }

      setCursor(newCursor || '');
      setHasMore(!endOfResults);
      setIsLoadingMore(false);
    },
    onError: err => {
      console.error('Error fetching movies:', err);
      setIsLoadingMore(false);
    }
  });

  const fetchMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Use GraphQL query for loading more movies
    fetchMovies({
      variables: {
        title: searchTerm,
        limit: 28,
        cursor
      }
    });
  };

  // Set it off
  useEffect(() => {
    fetchMovies({
      variables: {
        title: '',
        limit: 28,
        cursor: ''
      }
    });
  }, []);

  const onSearchHandler = {
    //   searchTerm
    // }:  onScroll
    // {
    //   searchTerm: string;
    // onScroll: (e: UIEvent<HTMLDivElement>) => void;
    // }) => {
    //   console.log('Search term:', searchTerm);
    //   // Reset cursor and set new search flag
    //   setCursor('');
    //   setHasMore(true);
    //   isNewSearchRef.current = true;
    //   setIsNewSearch(true);
    //   fetchMovies({
    //     variables: {
    //       title: searchTerm,
    //       limit: 28,
    //       cursor: ''
    //     }
    //   });
  };

  const setSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search term changed:', e.target.value);
    const term = e.target.value;
    setSearchTerm(term);
    setCursor('');
    setHasMore(true);
    isNewSearchRef.current = true;
    setIsNewSearch(true);
    fetchMovies({
      variables: {
        title: term,
        limit: 28,
        cursor: ''
      }
    });
  };

  return (
    <AboveTheFold pageSlug="all-movies" onScroll={fetchMoreMovies}>
      <div css={styles.listContainer}>
        <div css={styles.welcomeTitle}>All Movies</div>
        <div>Here's a big ol' list of movies.</div>
      </div>
      <MovieList
        movies={allMovies}
        totalMovieCount={totalMovieCount.toString()}
        setSearchTerm={setSearchTermHandler}
        searchTerm={searchTerm}
        onSearch={onSearchHandler}
        // openDeleteModal={() => {}}
      />

      {/* Loading indicator for lazy loading */}
      {isLoadingMore && (
        <div css={styles.loadingContainer}>
          <div css={styles.loadingText}>Loading more movies...</div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && allMovies.length > 0 && (
        <div css={styles.endContainer}>
          <div css={styles.endText}>You've reached the end! 🎬</div>
        </div>
      )}
    </AboveTheFold>
  );
};
const styles: { [key: string]: CSSObject } = {
  container: {
    flexDirection: 'column' as const,
    width: '100%',
    backgroundColor: baphSemanticColors.background.primary
  },
  listContainer: {
    maxWidth: '1720px',
    width: '100%',
    color: baphColors.lightText,
    marginTop: '1rem'
  },
  welcomeTitle: {
    ...baphTypography.styles.h1,
    color: baphColors.lightText,
    display: 'inline'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    marginTop: '2rem'
  },
  loadingText: {
    color: baphColors.lightText,
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
    color: baphColors.lightText,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    opacity: 0.6,
    textAlign: 'center' as const
  }
};
