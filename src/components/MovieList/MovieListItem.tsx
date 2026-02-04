import { useEffect, useRef, useState } from 'react';
import { CSSObject } from '@emotion/react';
import { ContainerScalingText, tokens } from 'athameui';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export type MovieListItemProps = {
  movie: {
    id: string;
    title: string;
    posterPath?: string;
    winningPercentage: number;
    tmdbId: string;
  };
};

export const MovieListItem = ({ movie }: MovieListItemProps) => {
  const liRef = useRef<HTMLLIElement>(null);
  const winningPercentage = movie.winningPercentage?.toFixed(2) || '0.00';
  const [major, minor] = winningPercentage.split('.');
  const [majorSize, setMajorSize] = useState('');
  const [minorSize, setMinorSize] = useState('');

  useEffect(() => {
    const updateFontSizes = () => {
      const width = liRef.current?.offsetWidth;
      setMajorSize(`${width! / 60}rem`);
      setMinorSize(`${width! / 75}rem`);
    };

    updateFontSizes();
    window.addEventListener('resize', updateFontSizes);
    return () => window.removeEventListener('resize', updateFontSizes);
  }, []);

  return (
    <li
      ref={liRef}
      css={getContainerStyles(movie.posterPath || '')}
      tabIndex={0}
      aria-label={`Open details for ${movie.title}`}
      data-testid={`movie-item-${movie.tmdbId}`}
      key={movie.id}
    >
      <Link
        to={`/movie/${movie.id}`}
        aria-label={`Open details for ${movie.title}`}
        className="block w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div
            data-state="active"
            title={`${movie.title} - ${winningPercentage}`}
          >
            {movie.posterPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
                css={baphStyles.poster}
              />
            ) : (
              <ContainerScalingText
                sx={{ container: baphStyles.posterWrapper }}
                maxFontSize={20}
                minFontSize={6}
              >
                Not found
              </ContainerScalingText>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              css={baphStyles.scoreWrapper}
              data-testid="movie-winning-percentage"
            >
              <span css={baphStyles.major} style={{ fontSize: majorSize }}>
                {major}.
              </span>

              <span css={baphStyles.minor} style={{ fontSize: minorSize }}>
                {minor}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </li>
  );
};

const getContainerStyles = (posterPath: string): CSSObject => ({
  position: 'relative' as const,
  display: 'flex',
  cursor: 'pointer',
  backgroundImage: posterPath ? `url(${posterPath})` : 'none'
});

const baphStyles = {
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
    border: `2px solid ${tokens.color.primary.vibrant[500]}`
  },
  scoreWrapper: {
    position: 'absolute' as const,
    bottom: '5px',
    right: '10px',
    display: 'flex',
    alignItems: 'baseline',
    lineHeight: 'normal'
  },
  major: {
    color: tokens.color.primary.vibrant[500],
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${tokens.color.primary.vibrant[700]}`,
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
  },
  minor: {
    color: tokens.color.primary.vibrant[500],
    fontWeight: 'bold',
    WebkitTextStroke: `1px ${tokens.color.primary.vibrant[700]}`,
    paintOrder: 'stroke fill',
    marginLeft: '2px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
  }
};
