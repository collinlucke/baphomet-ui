import { Main, Carousel, tokens, minXl } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading';
import { GET_MOVIE_DETAILS } from '../../api/queries';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';
import { formatGenres } from '../../utils/formatGenres';
import type { MovieDetailsResponse } from '../../types/movies.types';
import { PersonCard } from '../../components/PersonCard/PersonCard';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const { data } = useQuery<MovieDetailsResponse>(GET_MOVIE_DETAILS, {
    variables: { id }
  });
  const movie = data?.movieResults;
  const releaseYear = movie?.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const title = movie ? (
    <>
      {' '}
      <span css={baphStyles.title}>{movie.title}</span>{' '}
      <span css={baphStyles.releaseYear}>({releaseYear})</span>
    </>
  ) : (
    'Movie Details'
  );
  const genres = (
    <span css={baphStyles.genres}>{formatGenres(movie?.genres)}</span>
  );
  const { major, minor } = movie?.winningPercentage
    ? (() => {
        const wp = movie.winningPercentage.toFixed(2);
        const [m, n] = wp.split('.');
        return { major: m, minor: n };
      })()
    : { major: '0', minor: '00' };

  const detailItem = ({
    name,
    value
  }: {
    name: string;
    value: string | number | undefined;
  }) => (
    <div css={baphStyles.detailItem}>
      <div css={baphStyles.detailName}>{name}</div>
      <div css={baphStyles.detailValue}>{value}</div>
    </div>
  );

  return (
    <Main>
      <PageHeading
        title={title}
        subtitle={genres}
        rightContent={
          <div css={baphStyles.scoreWrapper}>
            <span css={baphStyles.major}>{`${major}`}.</span>
            <span css={baphStyles.minor}>{minor}</span>
          </div>
        }
      />
      <div css={baphStyles.detailsContainer}>
        <div css={baphStyles.posterContainerWrapper}>
          <div css={baphStyles.posterContainer}>
            <img
              src={movie?.posterImages?.w500}
              alt={movie?.title}
              css={baphStyles.poster}
            />
            {movie?.tagline && (
              <span css={baphStyles.tagline}>{movie?.tagline}</span>
            )}
          </div>
          <div css={baphStyles.detailItemsWrapper}>
            {detailItem({
              name: 'Director',
              value: movie?.crew
                ?.filter(person => person.job === 'Director')
                .map(director => director.name)
                .join(', ')
            })}
            {detailItem({ name: 'Release Date', value: movie?.releaseDate })}
            {detailItem({ name: 'Revenue', value: movie?.revenue })}
            {detailItem({ name: 'Rated', value: movie?.mpaRating })}
          </div>
        </div>
        <div css={baphStyles.overview}>
          <div css={baphStyles.overviewText}>{movie?.overview}</div>
          <Carousel>
            {[...(movie?.cast ?? [])]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .slice(0, 10)
              .map(person => (
                <PersonCard
                  key={person.personId}
                  person={{
                    id: person.personId,
                    name: person.name || '',
                    role: person.character,
                    profilePath: person.profilePath || ''
                  }}
                />
              ))}
          </Carousel>
        </div>
      </div>
    </Main>
  );
};

export default MovieDetailsPage;

const baphStyles = {
  title: {
    fontSize: '1.75em'
  },
  releaseYear: {
    fontSize: '1em',
    marginLeft: '0.25em'
  },
  scoreWrapper: {
    fontWeight: 600 as const,
    position: 'absolute' as const,
    right: 0,
    color: tokens.color.error[400]
  },
  genres: {
    fontStyle: 'italic'
  },
  major: {
    fontSize: '6em'
  },
  minor: {
    fontSize: '3.5em'
  },
  detailsContainer: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    marginTop: '20px',
    gap: '20px',
    flexDirection: 'column' as const,
    [minXl]: {
      flexDirection: 'row' as const
    }
  },
  posterContainer: {
    padding: '15px',
    maxWidth: '300px',
    height: '100%',
    flex: 2,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    borderRadius: '10px',
    outline: `5px solid ${tokens.color.secondary[800]}`,
    outlineOffset: '-5px'
  },
  posterContainerWrapper: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '20px'
    // [minMd]: {
    //   flexDirection: 'column' as const
    // }
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '5px'
  },
  tagline: {
    fontStyle: 'italic',
    marginTop: '10px'
  },
  detailItemsWrapper: {
    maxWidth: '175px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    flex: 1.5
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  detailName: {
    fontWeight: 600 as const,
    width: '120px'
  },
  detailValue: {
    marginLeft: '10px',
    fontWeight: 400 as const
  },
  overview: {
    display: 'flex',
    flex: '3 1 0',
    flexDirection: 'column' as const,
    minWidth: 0,
    backgroundColor: tokens.color.secondary[500],
    padding: '15px',
    borderRadius: '10px'
  },
  overviewText: {
    marginBottom: '30px'
  }
};
