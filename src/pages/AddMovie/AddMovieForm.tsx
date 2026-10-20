import { useState } from 'react';
import { FormField, FormLabel, Carousel } from 'athameui';
import { CSSObject } from '@emotion/react';
import { SaveButtonGroup } from '../../components/Buttons/SaveButtonGroup';
import type {
  CurrentMovie,
  CrewCredit,
  MovieVideo
} from '../../types/movies.types';
import { currentMovieVar } from './addMoviePageReactiveVars';
import { formatGenres } from '../../utils/formatGenres';
import { PersonCard } from '../../components/PersonCard/PersonCard';
import { AddMovieImageModal } from './AddMovieImageModal';
import { AddMovieVideoModal } from './AddMovieVideoModal';

type MovieDetailsFormProps = {
  currentMovie?: CurrentMovie;
  onFormFieldChange: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  directorsLabel: string;
  isExistingMovie: boolean;
  isLoading: boolean;
  clearFormHandler: () => void;
  deleteMovieHandler: () => void;
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
  deleteMovieHandler,
  onFormFieldChange,
  onSubmit,
  searchByTmdbIdHandler
}: MovieDetailsFormProps) => {
  const [imagePicker, setImagePicker] = useState<'poster' | 'backdrop' | null>(
    null
  );
  const [videoPickerOpen, setVideoPickerOpen] = useState(false);

  const onFormFieldChangeHandler =
    (field: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      onFormFieldChange(field)(e);
    };

  const selectImage = (filePath: string) => {
    const field = imagePicker === 'backdrop' ? 'backdropPath' : 'posterPath';
    onFormFieldChange(field)({
      target: { value: filePath }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const selectVideo = (video: MovieVideo) => {
    currentMovieVar({
      ...currentMovieVar(),
      videos: [video]
    });
  };

  const trailer = currentMovie?.videos?.[0];

  const SaveButtonGroupWithProps = () => (
    <SaveButtonGroup
      isLoading={isLoading}
      clearFormHandler={clearFormHandler}
      deleteMovieHandler={deleteMovieHandler}
      searchByTmdbIdHandler={searchByTmdbIdHandler}
    />
  );

  return (
    <form
      css={baphStyles.form}
      onSubmit={async event => {
        event.preventDefault();
        await onSubmit();
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
          readOnly
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
          readOnly
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
          readOnly
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
          readOnly
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
          readOnly
        />
        <FormField
          id="movie-revenue"
          label="Revenue"
          type="text"
          value={
            currentMovie?.revenue
              ? Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(Number(currentMovie.revenue))
              : '0.00'
          }
          onChange={onFormFieldChangeHandler('revenue')}
          placeholder="Revenue"
          size="medium"
          dark
          readOnly
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
          readOnly
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
          readOnly
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <Carousel label={directorsLabel}>
          {currentMovie?.crew
            ?.filter((person: CrewCredit) => person.job === 'Director')
            .map((person: CrewCredit) => (
              <PersonCard
                key={person.personId}
                person={{
                  id: person.personId,
                  name: person.name || '',
                  role: person.job,
                  profilePath: person.profilePath || '',
                  profileImages: person.profileImages,
                  __typename: 'CrewCredit'
                }}
              />
            ))}
        </Carousel>

        <Carousel label="Top Billed Cast">
          {[...(currentMovie?.cast ?? [])]
            .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
            .map(person => (
              <PersonCard
                key={person.personId}
                person={{
                  id: person.personId,
                  name: person.name || '',
                  role: person.character,
                  profilePath: person.profilePath || '',
                  profileImages: person.profileImages,
                  __typename: 'CastCredit'
                }}
              />
            ))}
        </Carousel>
      </div>
      <div css={baphStyles.movieDetailsImageFieldGroup}>
        <button
          type="button"
          css={baphStyles.previewButton}
          aria-label="Choose a poster"
          onClick={() => setImagePicker('poster')}
        >
          <div css={baphStyles.posterImgwWrapper}>
            <FormLabel label="Poster" dark />
            {currentMovie?.posterPath ? (
              <img
                css={baphStyles.previewButtonImage}
                src={`https://image.tmdb.org/t/p/w300${currentMovie?.posterPath}`}
                alt=""
              />
            ) : (
              <div css={baphStyles.posterImg}>No Poster Available</div>
            )}
          </div>
        </button>
        <button
          type="button"
          css={baphStyles.previewButton}
          aria-label="Choose a backdrop"
          onClick={() => setImagePicker('backdrop')}
        >
          <div css={baphStyles.backdropImgwWrapper}>
            <FormLabel label="Backdrop" dark />
            {currentMovie?.backdropPath ? (
              <img
                css={baphStyles.previewButtonImage}
                src={`https://image.tmdb.org/t/p/w1280${currentMovie?.backdropPath}`}
                alt=""
              />
            ) : (
              <div css={baphStyles.backdropImg}>No Backdrop Available</div>
            )}
          </div>
        </button>
      </div>
      <div css={baphStyles.trailerBlock}>
        <FormLabel label="Trailer" dark />
        {trailer?.key ? (
          <div css={baphStyles.trailerFrame}>
            <iframe
              css={baphStyles.trailer}
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
              title={trailer.name || 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              type="button"
              css={baphStyles.trailerChoose}
              onClick={() => setVideoPickerOpen(true)}
            >
              Choose a different trailer
            </button>
          </div>
        ) : (
          <button
            type="button"
            css={baphStyles.previewButton}
            onClick={() => setVideoPickerOpen(true)}
          >
            No trailer selected
          </button>
        )}
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
      <AddMovieVideoModal
        isOpen={videoPickerOpen}
        tmdbId={currentMovie?.tmdbId}
        selectedKey={trailer?.key}
        onClose={() => setVideoPickerOpen(false)}
        onSelect={selectVideo}
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
  },
  trailer: {
    width: '100%',
    aspectRatio: '16 / 9',
    border: 'none'
  },
  trailerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  trailerFrame: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  trailerChoose: {
    alignSelf: 'flex-start',
    padding: 0,
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  posterImg: {
    marginTop: '.75rem'
  }
};
