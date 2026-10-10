import { FormLabel, Carousel } from 'athameui';
import { CSSObject } from '@emotion/react';
import { SaveButtonGroup } from './SaveButtonGroup';
import type { CurrentMovie } from './AddMoviesPage';
import { formatGenres } from '../../utils/formatGenres';
import { PersonCard } from '../../components/PersonCard/PersonCard';
import { AddMovieReadOnlyField } from '../../components/MovieList/AddMovieReadOnlyField';

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
  onSubmit: () => void;
};

export const AddMovieForm = ({
  currentMovie = { title: '' },
  directorsLabel,
  isLoading,

  clearFormHandler,
  onSubmit,
  removePerson,
  searchByTmdbIdHandler
}: MovieDetailsFormProps) => {
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
  const pathWrapperStyles: CSSObject = {
    ...baphStyles.movieDetailsFormFieldGroup,
    fontSize: '1rem'
  };
  console.log(pathWrapperStyles);
  return (
    <form css={baphStyles.form} action={onSubmitHandler}>
      <SaveButtonGroupWithProps />
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <AddMovieReadOnlyField
          label={'Title'}
          value={currentMovie?.title || ''}
        />
        <AddMovieReadOnlyField
          label={'TMDB ID'}
          value={currentMovie?.tmdbId || ''}
        />
        <AddMovieReadOnlyField
          label={'Release Date'}
          value={currentMovie?.releaseDate || ''}
        />
        <AddMovieReadOnlyField
          label={'MPA Rating'}
          value={currentMovie?.mpaRating || ''}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <AddMovieReadOnlyField
          label={'Genres'}
          value={formatGenres(currentMovie?.genres)}
        />
        <AddMovieReadOnlyField
          label={'Revenue'}
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(parseInt(currentMovie?.revenue ?? '0'))}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <AddMovieReadOnlyField
          label={'Overview'}
          value={currentMovie?.overview ?? ''}
        />
        <AddMovieReadOnlyField
          label={'Tagline'}
          value={currentMovie?.tagline ?? ''}
        />
      </div>

      <div css={baphStyles.movieDetailsFormFieldGroup}>
        <div css={baphStyles.carouselContainer}>
          <FormLabel label={directorsLabel} dark />
          <Carousel>
            {currentMovie?.directors?.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                removePerson={removePerson}
              />
            ))}
          </Carousel>
        </div>
        <div css={baphStyles.carouselContainer}>
          <FormLabel label="Top Billed Cast" dark />
          <Carousel>
            {currentMovie?.topBilledCast?.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                removePerson={removePerson}
              />
            ))}
          </Carousel>
        </div>
      </div>
      <div
        css={{
          ...baphStyles.movieDetailsFormFieldGroup,
          width: 'min-content'
        }}
      >
        <AddMovieReadOnlyField
          label={'Poster Path'}
          value={currentMovie?.posterPath || ''}
        />
        <AddMovieReadOnlyField
          label={'Backdrop Path'}
          value={currentMovie?.backdropPath || ''}
        />
      </div>
      <div css={baphStyles.movieDetailsFormFieldGroup}>
        {currentMovie?.posterPath ? (
          <img
            css={baphStyles.posterImg}
            src={`https://image.tmdb.org/t/p/w300${currentMovie?.posterPath}`}
            alt="Poster Preview"
          />
        ) : (
          <div css={baphStyles.posterImg}>No Poster Available</div>
        )}
        <div css={baphStyles.backdropContainer}>
          {currentMovie?.backdropPath ? (
            <img
              css={baphStyles.backdropImg}
              src={`https://image.tmdb.org/t/p/w1280${currentMovie?.backdropPath}`}
              alt="Backdrop Preview"
            />
          ) : (
            <div>No Backdrop Available</div>
          )}
        </div>
      </div>
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
  carouselContainer: {
    overflow: 'hidden',
    minWidth: '200px'
  },
  posterImg: {
    width: '100%',
    maxWidth: '195px',
    height: '100%',
    objectFit: 'contain'
  },
  backdropImg: {
    width: '100%'
  }
};
