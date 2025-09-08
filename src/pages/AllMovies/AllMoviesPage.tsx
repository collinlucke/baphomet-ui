import { useState, useEffect, useRef } from 'react';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import { BodySection } from '../../components/BodySection';
import { PageHeading } from '../../components/PageHeading';
import { ScrollToTop } from '../../components/ScrollToTop';
import { useLazyQuery } from '@apollo/client/react';

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
  tmdbId: string;
};

type MovieResults = {
  searchResults: Movie[];
  newCursor: string;
  endOfResults: boolean;
  newTotalMovieCount: number;
};

export const AllMoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursor, setCursor] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const isNewSearchRef = useRef(true);

  const [fetchMovies, { data, error }] = useLazyQuery<{
    movieResults: MovieResults;
  }>(GET_MOVIES_BY_TITLE);

  useEffect(() => {
    if (data) {
      const { searchResults, newCursor, endOfResults, newTotalMovieCount } =
        data.movieResults;

      setTotalMovieCount(newTotalMovieCount || 0);

      if (isNewSearchRef.current) {
        setAllMovies(searchResults || []);
        isNewSearchRef.current = false;
      } else {
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
    }
    if (error) {
      console.error('Error fetching movies:', error);
      setIsLoadingMore(false);
    }
  }, [data]);

  const fetchMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
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

  const setSearchTermHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCursor('');
    setHasMore(true);
    isNewSearchRef.current = true;
    fetchMovies({
      variables: {
        title: term,
        limit: 28,
        cursor: ''
      }
    });
  };

  return (
    <BodySection pageSlug="all-movies">
      <PageHeading
        title="All Movies"
        subtitle="Here's a big ol' list of movies."
      />
      <MovieList
        movies={allMovies}
        totalMovieCount={totalMovieCount.toString()}
        setSearchTerm={setSearchTermHandler}
        searchTerm={searchTerm}
        onScroll={fetchMoreMovies}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
      <ScrollToTop />
    </BodySection>
  );
};
