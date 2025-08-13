import {
  baseVibrantColors,
  baseColors,
  Button
} from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { isMobileAndLandscapeVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client';

type MovieCardProps = {
  isVoting?: boolean;
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    releaseDate?: string;
  };
  handleVote: (movieId: string) => void;
  // Accessibility props
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  role?: string;
  dataTestId?: string;
  autoFocus?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
};

export const MovieCard: React.FC<MovieCardProps> = ({
  isVoting,
  movie,
  handleVote,
  ariaLabel,
  ariaDescribedBy,
  tabIndex = 0,
  role = 'button',
  dataTestId,
  autoFocus = false,
  onKeyDown,
  onFocus,
  onBlur
}) => {
  const isMobileAndLandscape = useReactiveVar(isMobileAndLandscapeVar);

  // Handle keyboard interaction for voting
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isVoting) {
        handleVote(movie.id);
      }
    }
    onKeyDown?.(event);
  };

  // Generate accessible label
  const generateAriaLabel = (): string => {
    if (ariaLabel) return ariaLabel;

    const year = movie.releaseDate
      ? new Date(movie.releaseDate).getFullYear()
      : '';
    const yearText = year ? ` from ${year}` : '';
    const voteText = isVoting
      ? ' (voting in progress)'
      : ', click to vote for this movie';

    return `${movie.title}${yearText}${voteText}`;
  };

  const getMoviePosterStyles = (): CSSObject => {
    return {
      ...baphStyles.posterImage,
      width: isMobileAndLandscape ? '275px' : '250px',
      height: isMobileAndLandscape ? '275px' : '375px'
    };
  };

  return (
    <div
      css={baphStyles.movieContainer}
      data-testid={dataTestId || `movie-container-${movie.id}`}
    >
      <div
        css={[baphStyles.movieCard, isVoting && baphStyles.movieCardDisabled]}
        onClick={() => !isVoting && handleVote(movie.id)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={isVoting ? -1 : tabIndex}
        role={role}
        aria-label={generateAriaLabel()}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isVoting}
        autoFocus={autoFocus}
        data-testid={`movie-card-${movie.id}`}
      >
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} movie poster`}
            css={getMoviePosterStyles()}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div css={baphStyles.noPosterPlaceholder} aria-hidden="true">
            No Poster
          </div>
        )}

        <div css={baphStyles.movieOverlay}>
          <h3 css={baphStyles.movieTitle}>{movie.title}</h3>
          {movie.releaseDate && (
            <p css={baphStyles.movieYear}>
              {new Date(movie.releaseDate).getFullYear()}
            </p>
          )}
        </div>
      </div>
      {!isMobileAndLandscape && (
        <div css={baphStyles.actionButtonContainer}>
          <Button
            kind="primary"
            size="large"
            onClick={() => handleVote(movie.id)}
            disabled={isVoting}
            ariaLabel={`Vote for ${movie.title}`}
            dataTestId={`vote-button-${movie.id}`}
          >
            {isVoting ? 'Voting...' : 'Choose This Movie'}
          </Button>
        </div>
      )}
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  movieCard: {
    position: 'relative',
    width: '250px',
    height: 'auto',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: `2px solid ${baseColors.tertiary[600]}`,
    '&:hover': {
      transform: 'scale(1.05)',
      border: `2px solid ${baseVibrantColors.primary[500]}`,
      boxShadow: `0 8px 32px rgba(${baseVibrantColors.primary[500]}, 0.3)`
    }
  },
  movieCardDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7,
    '&:hover': {
      transform: 'none',
      border: `2px solid ${baseColors.tertiary[600]}`,
      boxShadow: 'none'
    }
  },
  posterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noPosterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: baseColors.secondary[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: baseColors.tertiary[400],
    fontSize: '1.2rem',
    textAlign: 'center'
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
    padding: '.5rem',
    color: 'white'
  },
  movieTitle: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '400',
    textShadow:
      '-1px -1px 3px black, 1px -1px 3px black, -1px 1px 3px black, 1px 1px 3px black',
    lineHeight: '1.2',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  movieYear: {
    margin: '0.25rem 0 0',
    fontSize: '0.75rem',
    color: baseColors.tertiary[300],
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
  },
  movieContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    maxWidth: '400px'
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    zIndex: 10
  }
};
