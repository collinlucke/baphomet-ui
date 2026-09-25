import { CSSObject } from '@emotion/react';
import { Button, ButtonGroup } from 'athameui';
import { useReactiveVar } from '@apollo/client/react';
import { currentMovieVar } from './addMoviesPageReactiveVars';
import {
  isExistingMovieVar,
  isMovieLoadingVar
} from './addMoviesPageReactiveVars';

type SaveButtonGroupProps = {
  isLoading?: boolean;

  searchByTmdbIdHandler: (tmdbId: number) => void;
  clearFormHandler: () => void;
};

export const SaveButtonGroup = ({
  isLoading,
  searchByTmdbIdHandler,
  clearFormHandler
}: SaveButtonGroupProps) => {
  const isMovieLoading = useReactiveVar(isMovieLoadingVar);
  const isExistingMovie = isExistingMovieVar();
  const currentMovie = useReactiveVar(currentMovieVar);

  const fetchByTmdbIdHandler = () => {
    if (currentMovie?.tmdbId) {
      searchByTmdbIdHandler(currentMovie.tmdbId);
    }
  };

  return (
    <ButtonGroup sx={{ buttonGroup: baphStyles.saveButtonGroup }}>
      <Button
        size="small"
        variant="secondary"
        type="submit"
        disabled={!currentMovie?.title || isLoading}
        dark
      >
        {isMovieLoading
          ? 'Loading...'
          : isExistingMovie
            ? 'Update Movie'
            : 'Add Movie'}
      </Button>
      {isExistingMovie && (
        <Button
          size="small"
          variant="secondary"
          dark
          onClick={fetchByTmdbIdHandler}
          disabled={isLoading}
        >
          Refetch from TMDB
        </Button>
      )}
      <Button
        size="small"
        variant="outline"
        dark
        type="reset"
        onClick={clearFormHandler}
      >
        Clear
      </Button>
    </ButtonGroup>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  saveButtonGroup: {
    alignSelf: 'flex-end'
  }
};
