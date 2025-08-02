import React from 'react';
import { CSSObject } from '@emotion/react';
// import {
//   baphColors,
//   baphVibrantColors,
//   baphTypography
// } from '../../styling/baphTheme';

export interface MovieListItemProps {
  movie: {
    _id: string;
    posterUrl: string;
    winningPercentage: number;
  };
}

export const MovieListItem: React.FC<MovieListItemProps> = ({ movie }) => {
  const score = movie.winningPercentage.toFixed(2);
  const [major, minor] = score.split('.');
  const {
    container,
    posterWrapper,
    poster,
    scoreWrapper,
    major: majorStyle,
    minor: minorStyle
  } = baphStyles(movie.posterUrl);

  return (
    <div css={container} key={movie._id}>
      <div css={posterWrapper}>
        <div css={poster} />
        <div css={scoreWrapper}>
          <span css={majorStyle}>{major}.</span>
          <span css={minorStyle}>{minor}</span>
        </div>
      </div>
    </div>
  );
};

const baphStyles = (posterUrl: string): { [key: string]: CSSObject } => ({
  container: {
    margin: '16px'
  },
  posterWrapper: {
    position: 'relative',
    width: '170px',
    aspectRatio: '2 / 3'
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${posterUrl})`,
    backgoundColor: '#ccc',
    backgroundSize: 'cover'
    // border: `3px solid ${baphVibrantColors.primary[500]}`
  },
  scoreWrapper: {
    position: 'absolute',
    bottom: '-35px',
    right: '-30px',
    display: 'flex',
    alignItems: 'baseline'
  },
  major: {
    // color: baphColors.primary,
    // fontSize: baphTypography.fontSize['6xl'],
    // fontWeight: baphTypography.fontWeight.bold,
    // WebkitTextStroke: `3px ${baphVibrantColors.primary[500]}`,
    paintOrder: 'stroke fill'
  },
  minor: {
    // color: baphColors.primary,
    // fontSize: baphTypography.fontSize['4xl'],
    // fontWeight: baphTypography.fontWeight.bold,
    // WebkitTextStroke: `3px ${baphVibrantColors.primary[500]}`,
    // paintOrder: 'stroke fill',
    marginLeft: '2px'
  }
});
