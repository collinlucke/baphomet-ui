import { useState } from 'react';
import { CSSObject } from '@emotion/react';
import { baseColors, baseVibrantColors } from '@collinlucke/phantomartist';

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
  const [showTooltip, setShowTooltip] = useState(false);

  const openMovieDetailsHandler = (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (
      (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') ||
      e.type === 'click'
    ) {
      console.log(`Opening details for movie with TMDB ID: ${movie.tmdbId}`);
      openMovieDetails(movie.tmdbId || '');
    }
  };
  console.log(movie);
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
      {showTooltip && movie.title && (
        <div css={baphStyles.tooltip}>
          <span>{movie.title}</span>
        </div>
      )}
      <div
        css={baphStyles.posterWrapper}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
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
    fontSize: '2.5rem',
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${baseColors.primary[700]}`,
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
  },
  minor: {
    color: baseVibrantColors.primary[500],
    fontSize: '1.5rem',
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${baseColors.primary[700]}`,
    paintOrder: 'stroke fill',
    marginLeft: '2px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
  },
  tooltip: {
    width: 'max-content',
    textAlign: 'center' as const,
    fontSize: '.75rem',
    backgroundColor: baseColors.tertiary[50],
    color: baseColors.primary[500],
    padding: '2px 12px',
    borderRadius: '2px',
    boxShadow: `0 2px 8px ${baseColors.primary[500]}`,
    whiteSpace: 'nowrap',
    position: 'absolute' as const,
    left: '100%',
    zIndex: 10,
    '&:after': {
      content: '""',
      position: 'absolute' as const,
      right: '100%',
      top: '25%',
      rotate: '90deg',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: `${baseColors.tertiary[50]} transparent transparent transparent`
    }
  }
};
