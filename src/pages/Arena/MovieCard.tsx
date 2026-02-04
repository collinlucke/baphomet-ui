import { tokens } from 'athameui';
import { CSSObject } from '@emotion/react';
import { isMobileVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import party from 'party-js';

type MovieCardProps = {
  isVoting?: boolean;
  movie: {
    id: string;
    title: string;
    posterPath?: string;
    releaseDate?: string;
    backdropPath?: string;
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
  };
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  dataTestId?: string;
  autoFocus?: boolean;

  handleVote: (movieId: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
};

export const MovieCard = ({
  isVoting,
  movie,
  ariaLabel,
  ariaDescribedBy,
  tabIndex = 0,
  dataTestId,
  autoFocus = false,
  handleVote,
  onKeyDown,
  onFocus,
  onBlur
}: MovieCardProps) => {
  const isMobile = useReactiveVar(isMobileVar);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isVoting) {
        handleVote(movie.id);
      }
    }
    onKeyDown?.(event);
  };

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isVoting) {
      handleVote(movie.id);

      const tempElement = document.createElement('div');
      tempElement.style.position = 'fixed';
      tempElement.style.left = `${event.clientX}px`;
      tempElement.style.top = `${event.clientY}px`;
      tempElement.style.pointerEvents = 'none';
      document.body.appendChild(tempElement);

      party.sparkles(tempElement, {
        count: party.variation.range(20, 40),
        size: party.variation.range(0.5, 1.5)
      });

      setTimeout(() => {
        document.body.removeChild(tempElement);
      }, 100);
    }
  };

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

  const posterImageUrl = movie?.posterImages?.w780 || '';

  const backdropImageUrl = movie?.backdropImages?.w780 || '';

  return (
    <div
      css={baphStyles.movieContainer}
      data-testid={dataTestId || `movie-container-${movie.id}`}
    >
      <div
        css={[
          getMovieCardStyles(backdropImageUrl, posterImageUrl, isMobile),
          isVoting && baphStyles.movieCardDisabled
        ]}
        onClick={onClickHandler}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={isVoting ? -1 : tabIndex}
        role="button"
        aria-label={generateAriaLabel()}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isVoting}
        autoFocus={autoFocus}
        data-testid={`movie-card-${movie.id}`}
      >
        <div css={baphStyles.movieOverlay}>
          <h3 css={baphStyles.movieTitle}>{movie.title}</h3>
          {movie.releaseDate && (
            <p css={baphStyles.movieYear}>
              {new Date(movie.releaseDate).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const getMovieCardStyles = (
  backdropImageUrl: string,
  posterImageUrl: string,
  isMobile: boolean
) => {
  return {
    ...baphStyles.movieCard,
    backgroundImage: `url(${backdropImageUrl})`,
    [tokens.media.min.lg]: {
      backgroundImage: isMobile
        ? `url(${backdropImageUrl})`
        : `url(${posterImageUrl})`,
      aspectRatio: isMobile ? '1.25/1' : '2/3',
      height: 'unset'
    }
  };
};

const baphStyles: { [key: string]: CSSObject } = {
  movieContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    width: '100%'
  },
  movieCard: {
    width: '100%',
    height: '180px',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: `2px solid ${tokens.color.tertiary[600]}`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: '20%',
    backgroundPositionX: 'center',
    '&:hover': {
      transform: 'scale(1.05)',
      border: `2px solid ${tokens.color.primary[500]}`,
      boxShadow: `0 8px 32px rgba(${tokens.color.primary[500]}, 0.3)`
    }
  },
  movieCardDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7,
    '&:hover': {
      transform: 'none',
      border: `2px solid ${tokens.color.tertiary[600]}`,
      boxShadow: 'none'
    }
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
    color: tokens.color.tertiary[300],
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
  }
};
