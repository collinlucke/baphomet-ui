import { FormInput, FormInputLabel } from 'athameui';
import { CSSObject } from '@emotion/react';
import { SaveButtonGroup } from './SaveButtonGroup';
import { PersonCardCarousel } from '../../components/PersonCard/PersonCardCarousel';
import type { CurrentMovie } from './AddMoviesPage';

type MovieDetailsFormProps = {
  currentMovie?: CurrentMovie;
  onFormFieldChange: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  removePerson: (id: number, roleType?: string) => void;
  directorsLabel: string;
  isExistingMovie: boolean;
  isLoading: boolean;
  clearFormHandler: () => void;
  updateMovie: () => void;
  addMovie: () => void;
  searchByTmdbIdHandler: (tmdbId: number) => void;
  onSubmit: () => void;
};

export const MovieDetailsForm = ({
  currentMovie = { title: '' },
  directorsLabel,
  isLoading,

  clearFormHandler,
  onFormFieldChange,
  onSubmit,
  removePerson,
  searchByTmdbIdHandler
}: MovieDetailsFormProps) => {
  const onFormFieldChangeHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onFormFieldChange(e.target.name);
  };

  const onSubmitHandler = () => {
    onSubmit();
  };

  const SaveButtonGroupWithProps = () => (
    <SaveButtonGroup
      isLoading={isLoading}
      clearFormHandler={clearFormHandler}
      searchByTmdbIdHandler={searchByTmdbIdHandler}
    />
  );

  return (
    <form css={baphStyles.form} action={onSubmitHandler}>
      <SaveButtonGroupWithProps />
      <FormInput
        label="Title"
        type="text"
        value={currentMovie?.title || ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Movie Title"
        size="medium"
        dark
      />
      <FormInput
        size="medium"
        label="Release Date"
        type="text"
        value={currentMovie?.releaseDate ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Release Date"
        dark
      />
      <FormInput
        size="medium"
        label="Genres"
        type="text"
        value={currentMovie?.genres?.join(', ') ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Genres, comma-separated"
        dark
      />
      <FormInput
        size="medium"
        label="Overview"
        type="text"
        value={currentMovie?.overview ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Overview"
        dark
      />
      <FormInput
        size="medium"
        label="Revenue"
        type="text"
        value={currentMovie?.revenue ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Revenue"
        dark
      />
      <FormInput
        size="medium"
        label="Poster Path"
        type="text"
        value={currentMovie?.posterPath ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Poster image path"
        dark
      />
      <FormInput
        size="medium"
        label="Backdrop Path"
        type="text"
        value={currentMovie?.backdropPath ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Backdrop image path"
        dark
      />
      <FormInput
        size="medium"
        label="Tagline"
        type="text"
        value={currentMovie?.tagline ?? ''}
        onChange={onFormFieldChangeHandler}
        placeholder="Tagline"
        dark
      />
      <div>
        <FormInputLabel label={directorsLabel} dark />
        <PersonCardCarousel
          people={currentMovie?.directors || []}
          removePerson={removePerson}
          roleType="Director"
        />
      </div>
      <div>
        <FormInputLabel label="Top Billed Cast" dark />
        <PersonCardCarousel
          people={currentMovie?.topBilledCast || []}
          removePerson={removePerson}
          roleType="Actor"
        />
      </div>
      <div
      // css={baphStyles.previewContainer}>
      >
        {currentMovie?.posterPath ? (
          <img
            // css={baphStyles.posterImg}
            src={`https://image.tmdb.org/t/p/w300${currentMovie?.posterPath}`}
            alt="Poster Preview"
          />
        ) : (
          <div
          // css={baphStyles.posterImg}
          >
            No Poster Available
          </div>
        )}
        {currentMovie?.backdropPath ? (
          <img
            // css={baphStyles.backdropImg}
            src={`https://image.tmdb.org/t/p/w1280${currentMovie?.backdropPath}`}
            alt="Backdrop Preview"
          />
        ) : (
          <div
          // css={baphStyles.backdropImg}
          >
            No Backdrop Available
          </div>
        )}
      </div>
      =
      <SaveButtonGroupWithProps />
    </form>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }
};
