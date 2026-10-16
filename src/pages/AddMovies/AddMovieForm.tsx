import { useRef, useState } from 'react';
import { FormField, FormLabel, Carousel } from 'athameui';
import { CSSObject } from '@emotion/react';
import { SaveButtonGroup } from './SaveButtonGroup';
import type { CurrentMovie } from './AddMoviesPage';
import { currentMovieVar } from './addMoviesPageReactiveVars';
import { formatGenres } from '../../utils/formatGenres';
import { PersonCard } from '../../components/PersonCard/PersonCard';
import { AddMovieImageModal } from './AddMovieImageModal';

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
  searchByTmdbIdHandler: (tmdbId: string) => void;
  onSubmit: () => Promise<void> | void;
};

export const AddMovieForm = ({
  currentMovie = { title: '' },
  directorsLabel,
  isLoading,

  clearFormHandler,
  onFormFieldChange,
  onSubmit,
  removePerson,
  searchByTmdbIdHandler
}: MovieDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePicker, setImagePicker] = useState<'poster' | 'backdrop' | null>(
    null
  );
  const snapshotRef = useRef<CurrentMovie | null>(null);

  const onFormFieldChangeHandler =
    (field: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      onFormFieldChange(field)(e);
    };

  const startEditing = () => {
    snapshotRef.current = structuredClone(currentMovie);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (snapshotRef.current) {
      currentMovieVar(snapshotRef.current);
    }
    setIsEditing(false);
  };

  const selectImage = (filePath: string) => {
    const field = imagePicker === 'backdrop' ? 'backdropPath' : 'posterPath';
    onFormFieldChange(field)({
      target: { value: filePath }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const SaveButtonGroupWithProps = () => (
    <SaveButtonGroup
      isEditing={isEditing}
      isLoading={isLoading}
      clearFormHandler={() => {
        clearFormHandler();
        setIsEditing(false);
      }}
      searchByTmdbIdHandler={searchByTmdbIdHandler}
      onEdit={startEditing}
      onCancel={cancelEditing}
    />
  );

  return (
    <form
      css={baphStyles.form}
      onSubmit={async event => {
        event.preventDefault();
        await onSubmit();
        setIsEditing(false);
      }}
    >
      <SaveButtonGroupWithProps />
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <FormField
          id="movie-title"
          label="Title"
          type="text"
          value={currentMovie?.title || ''}
          onChange={onFormFieldChangeHandler('title')}
          placeholder="Movie Title"
          size="medium"
          dark
          readOnly={!isEditing}
        />
        <FormField
          id="movie-tmdb-id"
          label="TMDB ID"
          type="text"
          value={currentMovie?.tmdbId ?? ''}
          onChange={onFormFieldChangeHandler('tmdbId')}
          placeholder="TMDB ID"
          size="medium"
          dark
          readOnly={!isEditing}
        />
        <FormField
          id="movie-release-date"
          label="Release Date"
          type="text"
          value={currentMovie?.releaseDate || ''}
          onChange={onFormFieldChangeHandler('releaseDate')}
          placeholder="Release Date"
          size="medium"
          dark
          readOnly={!isEditing}
        />
        <FormField
          id="movie-mpa-rating"
          label="MPA Rating"
          type="text"
          value={currentMovie?.mpaRating || ''}
          onChange={onFormFieldChangeHandler('mpaRating')}
          placeholder="MPA Rating"
          size="medium"
          dark
          readOnly={!isEditing}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <FormField
          id="movie-genres"
          label="Genres"
          type="text"
          value={formatGenres(currentMovie?.genres)}
          onChange={onFormFieldChangeHandler('genres')}
          placeholder="Genres, comma-separated"
          size="medium"
          dark
          readOnly={!isEditing}
        />
        <FormField
          id="movie-revenue"
          label="Revenue"
          type="text"
          value={currentMovie?.revenue ?? ''}
          onChange={onFormFieldChangeHandler('revenue')}
          placeholder="Revenue"
          size="medium"
          dark
          readOnly={!isEditing}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <FormField
          id="movie-overview"
          label="Overview"
          type="textarea"
          value={currentMovie?.overview ?? ''}
          onChange={onFormFieldChangeHandler('overview')}
          placeholder="Overview"
          size="medium"
          autoResize
          dark
          readOnly={!isEditing}
        />
        <FormField
          id="movie-tagline"
          label="Tagline"
          type="text"
          value={currentMovie?.tagline ?? ''}
          onChange={onFormFieldChangeHandler('tagline')}
          placeholder="Tagline"
          size="medium"
          dark
          readOnly={!isEditing}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <Carousel label={directorsLabel}>
          {currentMovie?.crew
            ?.filter(person => person.job === 'Director')
            .map(person => (
              <PersonCard
                key={person.personId}
                person={{
                  id: person.personId,
                  name: person.name || '',
                  role: person.job,
                  profilePath: person.profilePath || '',
                  __typename: 'CrewCredit'
                }}
                removePerson={isEditing ? removePerson : undefined}
              />
            ))}
        </Carousel>

        <Carousel label="Top Billed Cast">
          {[...(currentMovie?.cast ?? [])]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .slice(0, 10)
            .map(person => (
              <PersonCard
                key={person.personId}
                person={{
                  id: person.personId,
                  name: person.name || '',
                  role: person.character,
                  profilePath: person.profilePath || '',
                  __typename: 'CastCredit'
                }}
                removePerson={isEditing ? removePerson : undefined}
              />
            ))}
        </Carousel>
      </div>
      <div css={baphStyles.movieDetailsImageFieldGroup}>
        <button
          type="button"
          css={[
            baphStyles.previewButton,
            { cursor: isEditing ? 'pointer' : 'default' }
          ]}
          onClick={() => {
            if (isEditing) setImagePicker('poster');
          }}
        >
          <div css={baphStyles.posterImgwWrapper}>
            <FormLabel label="Poster" dark />
            {currentMovie?.posterPath ? (
              <img
                css={baphStyles.previewButtonImage}
                src={`https://image.tmdb.org/t/p/w300${currentMovie?.posterPath}`}
                alt="Poster Preview"
              />
            ) : (
              <div css={baphStyles.posterImg}>No Poster Available</div>
            )}
          </div>
        </button>
        <button
          type="button"
          css={[
            baphStyles.previewButton,
            { cursor: isEditing ? 'pointer' : 'default' }
          ]}
          onClick={() => {
            if (isEditing) setImagePicker('backdrop');
          }}
        >
          <div css={baphStyles.backdropImgwWrapper}>
            <FormLabel label="Backdrop" dark />
            {currentMovie?.backdropPath ? (
              <img
                css={baphStyles.previewButtonImage}
                src={`https://image.tmdb.org/t/p/w1280${currentMovie?.backdropPath}`}
                alt="Backdrop Preview"
              />
            ) : (
              <div css={baphStyles.backdropImg}>No Backdrop Available</div>
            )}
          </div>
        </button>
      </div>
      <AddMovieImageModal
        isOpen={imagePicker !== null}
        kind={imagePicker ?? 'poster'}
        tmdbId={currentMovie?.tmdbId}
        selectedPath={
          imagePicker === 'backdrop'
            ? currentMovie?.backdropPath
            : currentMovie?.posterPath
        }
        onClose={() => setImagePicker(null)}
        onSelect={selectImage}
      />
      <SaveButtonGroupWithProps />
    </form>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  movieDetailsFormFieldGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px'
  },
  movieDetailsImageFieldGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 2.75fr',
    gap: '24px',
    alignItems: 'start'
  },
  previewButton: {
    padding: 0,
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    color: 'inherit',
    cursor: 'pointer'
  },
  previewButtonImage: {
    marginTop: '.75rem',
    width: '100%',
    height: 'auto',
    objectFit: 'contain'
  }
};
