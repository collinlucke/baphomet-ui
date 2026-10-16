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
  isEditing: boolean;

  searchByTmdbIdHandler: (tmdbId: string) => void;
  clearFormHandler: () => void;
  onEdit: () => void;
  onCancel: () => void;
};

export const SaveButtonGroup = ({
  isLoading,
  isEditing,
  searchByTmdbIdHandler,
  clearFormHandler,
  onEdit,
  onCancel
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
      {!isEditing && (
        <Button
          size="small"
          variant="secondary"
          type="button"
          dark
          onClick={onEdit}
          disabled={isLoading}
        >
          Edit Movie
        </Button>
      )}
      {isEditing && (
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
      )}
      {isExistingMovie && !isEditing && (
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
      {isEditing && (
        <Button
          size="small"
          variant="outline"
          dark
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
      {isEditing && (
        <Button
          size="small"
          variant="outline"
          dark
          type="button"
          onClick={clearFormHandler}
        >
          Clear
        </Button>
      )}
    </ButtonGroup>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  saveButtonGroup: {
    alignSelf: 'flex-end'
  }
};
