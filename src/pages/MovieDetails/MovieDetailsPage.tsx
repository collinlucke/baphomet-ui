import { Main, Carousel, Button, color, media, font } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading';
import { GET_MOVIE_DETAILS } from '../../api/queries';
import { useQuery } from '@apollo/client/react';
import { Link, useParams } from 'react-router-dom';
import { formatGenres } from '../../utils/formatGenres';
import type { MovieDetailsResponse } from '../../types/movies.types';
import { PersonCard } from '../../components/PersonCard/PersonCard';
import { isAuthenticatedVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

const MovieDetailsPage = () => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;
  const { id } = useParams();
  const { data } = useQuery<MovieDetailsResponse>(GET_MOVIE_DETAILS, {
    variables: { id }
  });
  const movie = data?.movieResults;
  const releaseYear = movie?.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;
  console.log(isAuthenticated, user);
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
            <div>
              <span css={baphStyles.major}>{`${major}`}.</span>
              <span css={baphStyles.minor}>{minor}</span>
            </div>
            {isAuthenticated && user && user.role === 'admin' && (
              <Link to={`/movies/${movie?.id}/edit`}>
                <Button variant="outline" dark size="small">
                  Edit Movie
                </Button>
              </Link>
            )}
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
          <h3>Overview</h3>
          <div css={baphStyles.overviewText}>{movie?.overview}</div>
          <h3>Top Billed Cast</h3>
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
    fontSize: font.size['3xl']
  },
  releaseYear: {
    fontSize: font.size['md'],
    marginLeft: '0.25em'
  },
  scoreWrapper: {
    fontWeight: 600 as const,
    position: 'absolute' as const,
    right: 0,
    top: 0,
    color: color.error[400],
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'end' as const
  },
  genres: {
    fontStyle: 'italic'
  },
  major: {
    fontSize: font.size['5xl']
  },
  minor: {
    fontSize: font.size['4xl']
  },
  detailsContainer: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    marginTop: '20px',
    gap: '20px',
    flexDirection: 'column' as const,
    [media.min.xl]: {
      flexDirection: 'row' as const
    }
  },
  posterContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    padding: '15px',
    maxWidth: '375px',
    height: 'fit-content',
    flex: 2,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    borderRadius: '10px',
    outline: `5px solid ${color.secondary[800]}`,
    outlineOffset: '-5px'
  },
  posterContainerWrapper: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '20px'
  },
  poster: {
    width: '100%',
    objectFit: 'cover' as const,
    borderRadius: '.5rem'
  },
  tagline: {
    fontStyle: 'italic',
    marginTop: '8px',
    fontSize: '.75rem'
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
    backgroundColor: color.secondary[500],
    padding: '15px',
    borderRadius: '10px'
  },
  overviewText: {
    marginBottom: '30px'
  }
};
