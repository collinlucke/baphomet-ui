import { CSSObject } from '@emotion/react';
import { Button, ButtonGroup } from 'athameui';
import { useReactiveVar } from '@apollo/client/react';
import { currentMovieVar } from '../../pages/AddMovie/addMoviePageReactiveVars';
import {
  isExistingMovieVar,
  isMovieLoadingVar
} from '../../pages/AddMovie/addMoviePageReactiveVars';

type SaveButtonGroupProps = {
  isLoading?: boolean;

  searchByTmdbIdHandler: (tmdbId: string) => void;
  clearFormHandler: () => void;
  deleteMovieHandler: () => void;
};

export const SaveButtonGroup = ({
  isLoading,
  searchByTmdbIdHandler,
  clearFormHandler,
  deleteMovieHandler
}: SaveButtonGroupProps) => {
  const isMovieLoading = useReactiveVar(isMovieLoadingVar);
  const isExistingMovie = isExistingMovieVar();
  const currentMovie = useReactiveVar(currentMovieVar);

  const fetchByTmdbIdHandler = () => {
    if (currentMovie?.tmdbId) {
      searchByTmdbIdHandler(currentMovie.tmdbId.toString());
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
      {currentMovie?.tmdbId && (
        <Button
          size="small"
          variant="secondary"
          dark
          type="button"
          onClick={fetchByTmdbIdHandler}
          disabled={isLoading}
        >
          Refetch from TMDB
        </Button>
      )}
      {isExistingMovie && (
        <Button
          size="small"
          variant="outline"
          dark
          type="button"
          onClick={deleteMovieHandler}
          disabled={isLoading}
        >
          Remove from database
        </Button>
      )}
      <Button
        size="small"
        variant="outline"
        dark
        type="button"
        onClick={clearFormHandler}
        disabled={isLoading}
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
