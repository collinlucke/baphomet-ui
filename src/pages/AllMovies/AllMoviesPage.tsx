import { useState, useEffect, useRef } from 'react';
import { GET_MOVIE_LIST_ITEMS } from '../../api/queries';
import { useLazyQuery } from '@apollo/client/react';
import type { Movie } from '../../types/movies.types';
import { Main, ScrollToTopButton } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading';
import { MovieList } from '../../components/MovieList/MovieList';

type MovieResults = {
  searchResults: Movie[];
  newCursor: string;
  endOfResults: boolean;
  newTotalMovieCount: number;
};

const AllMoviesPage = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursor, setCursor] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const isNewSearchRef = useRef(true);

  const [getMovieListItems, { data, error }] = useLazyQuery<{
    movieResults: MovieResults;
  }>(GET_MOVIE_LIST_ITEMS);

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
    getMovieListItems({
      variables: {
        title: searchTerm,
        limit: 28,
        cursor
      }
    });
  };

  // Set it off
  useEffect(() => {
    getMovieListItems({
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
    getMovieListItems({
      variables: {
        title: term,
        limit: 28,
        cursor: ''
      }
    });
  };

  return (
    <Main>
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
        sx={{ list: baphStyles.list }}
      />
      <ScrollToTopButton />
    </Main>
  );
};

export default AllMoviesPage;

const baphStyles = {
  list: {
    marginTop: '2rem'
  }
};
