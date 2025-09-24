import { CSSObject } from '@emotion/react';
import {
  baseColors,
  baseVibrantColors,
  mediaQueries
} from '@collinlucke/phantomartist';

export type MovieListItemProps = {
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    winningPercentage: number;
    tmdbId: string;
  };
  openMovieDetails: (tmdbId: string) => void;
};

export const MovieListItem: React.FC<MovieListItemProps> = ({
  movie,
  openMovieDetails
}) => {
  const winningPercentage = movie.winningPercentage?.toFixed(2) || '0.00';
  const [major, minor] = winningPercentage.split('.');

  const openMovieDetailsHandler = (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (
      (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') ||
      e.type === 'click'
    ) {
      openMovieDetails(movie.tmdbId || '');
    }
  };

  return (
    <li
      css={getContainerStyles(movie.posterUrl || '')}
      role="button"
      tabIndex={0}
      onClick={openMovieDetailsHandler}
      onKeyDown={openMovieDetailsHandler}
      aria-label={`Open details for ${movie.title}`}
      data-testid={`movie-item-${movie.tmdbId}`}
    >
      <div css={baphStyles.posterWrapper} title={movie.title}>
        <img src={movie.posterUrl} alt={movie.title} css={baphStyles.poster} />
        <div css={baphStyles.scoreWrapper}>
          <span css={baphStyles.major}>{major}.</span>
          <span css={baphStyles.minor}>{minor}</span>
        </div>
      </div>
    </li>
  );
};

const getContainerStyles = (posterUrl: string): CSSObject => ({
  ...baphStyles.container,
  backgroundImage: posterUrl ? `url(${posterUrl})` : 'none'
});

const baphStyles = {
  container: {
    position: 'relative' as const,
    display: 'flex',
    cursor: 'pointer'
  },
  posterWrapper: {
    position: 'relative' as const,
    flex: '1',
    aspectRatio: '2 / 3'
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    backgroundSize: 'cover',
    border: `2px solid ${baseVibrantColors.primary[500]}`
  },
  scoreWrapper: {
    position: 'absolute' as const,
    bottom: 0,
    right: '10px',
    display: 'flex',
    alignItems: 'baseline',
    lineHeight: 'normal'
  },
  major: {
    color: baseVibrantColors.primary[500],
    fontSize: '1.85rem',
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${baseColors.primary[700]}`,
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)',
    [mediaQueries.minWidth.sm]: {
      fontSize: '2rem'
    },
    [mediaQueries.minWidth.lg]: {
      fontSize: '2.5rem'
    },
    [mediaQueries.minWidth.xl]: {
      fontSize: '3rem'
    }
  },
  minor: {
    color: baseVibrantColors.primary[500],
    fontSize: '1.25rem',
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${baseColors.primary[700]}`,
    paintOrder: 'stroke fill',
    marginLeft: '2px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)',
    [mediaQueries.minWidth.sm]: {
      fontSize: '1.5rem'
    },
    [mediaQueries.minWidth.lg]: {
      fontSize: '1.85rem'
    },
    [mediaQueries.minWidth.xl]: {
      fontSize: '2.25rem'
    }
  }
};
