import React, { useState } from 'react';
import { CSSObject } from '@emotion/react';
import { baseColors, baseVibrantColors } from '@collinlucke/phantomartist';

export interface MovieListItemProps {
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    winningPercentage: number;
  };
}

export const MovieListItem: React.FC<MovieListItemProps> = ({ movie }) => {
  const winningPercentage = movie.winningPercentage?.toFixed(2) || '0.00';
  const [major, minor] = winningPercentage.split('.');
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    container,
    posterWrapper,
    poster,
    scoreWrapper,
    tooltip,

    major: majorStyle,
    minor: minorStyle
  } = baphStyles(movie.posterUrl || '');

  return (
    <div css={container} key={movie.id}>
      {showTooltip && movie.title && (
        <div css={tooltip}>
          <span>{movie.title || ''}</span>
        </div>
      )}
      <div
        css={posterWrapper}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img src={movie.posterUrl} alt={movie.title} css={poster} />
        <div css={scoreWrapper}>
          <span css={majorStyle}>{major || '00'}.</span>
          <span css={minorStyle}>{minor || '00'}</span>
        </div>
      </div>
    </div>
  );
};

const baphStyles = (posterUrl: string): { [key: string]: CSSObject } => ({
  container: {
    position: 'relative',
    display: 'flex'
  },
  posterWrapper: {
    position: 'relative',
    minWidth: '100px',
    aspectRatio: '2 / 3'
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundImage: posterUrl ? `url(${posterUrl})` : 'none',
    backgroundColor: '#ccc',
    backgroundSize: 'cover',
    border: `2px solid ${baseVibrantColors.primary[500]}`
  },
  scoreWrapper: {
    position: 'absolute',
    bottom: '-25px',
    right: '-20px',
    display: 'flex',
    alignItems: 'baseline'
  },
  major: {
    color: baseColors.primary[500],
    fontSize: '3rem',
    fontWeight: 'bold',
    WebkitTextStroke: `5px ${baseVibrantColors.primary[500]}`,
    paintOrder: 'stroke fill'
  },
  minor: {
    color: baseColors.primary[500],
    fontSize: '2rem',
    fontWeight: 'bold',
    WebkitTextStroke: `5px ${baseVibrantColors.primary[500]}`,
    paintOrder: 'stroke fill',
    marginLeft: '2px'
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
    position: 'absolute',
    right: '-50px',
    zIndex: 10,
    '&:after': {
      content: '""',
      position: 'absolute',
      right: '100%',
      top: '25%',
      rotate: '90deg',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: `${baseColors.tertiary[50]} transparent transparent transparent`
    }
  }
});
