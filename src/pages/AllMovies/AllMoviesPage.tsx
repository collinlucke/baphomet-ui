import { useState, useEffect } from 'react';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_ALL_MOVIES } from '../../api/queries';
import {
  baphSemanticColors,
  baphTypography,
  baphColors
} from '../../styling/baphTheme';
import { AboveTheFold } from '../../components/AboveTheFold';
import { CSSObject } from '@emotion/react';
import { useLazyQuery } from '@apollo/client';

export const AllMoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchMovies] = useLazyQuery(GET_ALL_MOVIES, {
    variables: { searchTerm },
    onCompleted: data => {
      console.log('Fetched movies:', data);
      setAllMovies(data.movieResults.searchResults || []);
    },
    onError: err => {
      console.error('Error fetching movies:', err);
    }
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  // Not necessary as this only for the search button - which we aren't using here
  const onSearchHandler = () => {
    fetchMovies();
  };

  return (
    <AboveTheFold pageSlug="all-movies">
      <div css={styles.listContainer}>
        <div css={styles.welcomeTitle}>All Movies</div>
        <div>Here's a big ol' list of movies.</div>
      </div>
      <MovieList
        movies={allMovies}
        totalMovieCount={allMovies?.length.toString()}
        onSearch={onSearchHandler}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        // openDeleteModal={() => {}}
      />
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
  }
};
