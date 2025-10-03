import { BodySection } from '../../components/BodySection';
import { PageHeading } from '../../components/PageHeading';
import { GET_MOVIE_DETAILS } from '../../api/queries';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';
import { baseColors } from 'phantomartist';

type MovieDetailsResponse = {
  movieResults: {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
    genres: string[];
    posterPath: string;
    backdropPath: string;
    posterImages?: {
      w92?: string;
      w154?: string;
      w185?: string;
      w342?: string;
      w500?: string;
      w780?: string;
      original?: string;
    };
    backdropImages?: {
      w92?: string;
      w154?: string;
      w185?: string;
      w342?: string;
      w500?: string;
      w780?: string;
      original?: string;
    };
    rated?: string;
    revenue?: number;
    tmdbId: string;
    winningPercentage: number;
    totalWins: number;
    totalLosses: number;
    totalComparisons: number;
    addedBy: string;
    lastUpdated: string;
    createdAt: string;
    directors?: string[];
    topBilledCast?: { id: number; name: string; profileUrl?: string }[];
    tagline?: string;
  };
};

export const MovieDetailsPage = () => {
  const { id } = useParams();

  const { data } = useQuery<MovieDetailsResponse>(GET_MOVIE_DETAILS, {
    variables: { id }
  });
  const movie = data?.movieResults;
  console.log(movie);
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
    <span css={baphStyles.genres}>{movie?.genres?.join(', ')}</span>
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
    <BodySection>
      <PageHeading
        title={title}
        subtitle={genres}
        rightContent={
          <div css={baphStyles.scoreWrapper}>
            <span css={baphStyles.major}>{`${major}`}</span>.
            <span css={baphStyles.minor}>{minor}</span>
          </div>
        }
      />
      <div css={baphStyles.detailsContainer}>
        <div css={baphStyles.posterContainer}>
          <img
            src={movie?.posterImages?.w500}
            alt={movie?.title}
            css={baphStyles.poster}
          />
          {movie?.tagline && <span>{movie?.tagline}</span>}
        </div>
        <div css={baphStyles.detailItemsWrapper}>
          {detailItem({
            name: 'Director',
            value: movie?.directors?.join(', ')
          })}
          {detailItem({ name: 'Release Date', value: movie?.releaseDate })}
          {detailItem({ name: 'Revenue', value: movie?.revenue })}
          {detailItem({ name: 'Rated', value: movie?.rated })}
        </div>
        <div css={baphStyles.overview}>{movie?.overview}</div>
      </div>
    </BodySection>
  );
};

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
    color: baseColors.accent[400]
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
    marginTop: '20px',
    gap: '20px'
  },
  posterContainer: {
    maxWidth: '300px',
    flex: 2,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    borderRadius: '10px',
    outline: `5px solid ${baseColors.secondary[800]}`,
    outlineOffset: '-5px'
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    padding: '15px',
    borderRadius: '20px'
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
    flex: 3,
    backgroundColor: baseColors.secondary[500],
    padding: '15px',
    borderRadius: '10px'
  }
};
