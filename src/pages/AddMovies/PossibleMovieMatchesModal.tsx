import { CSSObject } from '@emotion/react';
import {
  baseColors,
  baseVibrantColors,
  Button,
  Modal
} from '@collinlucke/phantomartist';
import type { PossibleMovieMatch } from './AddMoviesPage';

type PossibleMovieMatchesProps = {
  possibleMatches: PossibleMovieMatch[];
  showModal: boolean;
  handleCloseModal: () => void;
  handleSelectMovie: (tmdbId: string) => void;
};

export const PossibleMovieMatchesModal: React.FC<PossibleMovieMatchesProps> = ({
  possibleMatches,
  handleSelectMovie,
  showModal,
  handleCloseModal
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title="Search Results"
      maxWidth="800px"
      dataTestId="movie-search-modal"
    >
      <div css={baphStyles.modalContent}>
        <p css={baphStyles.modalDescription}>
          Found {possibleMatches.length} movie
          {possibleMatches.length !== 1 ? 's' : ''}. Click "Select Movie" to use
          one of these results.
        </p>

        <div css={baphStyles.movieResults}>
          {possibleMatches.map(movie => (
            <div key={movie.id} css={baphStyles.movieResultItem}>
              <div css={baphStyles.moviePoster}>
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                    alt={`${movie.title} poster`}
                    css={baphStyles.posterImage}
                  />
                ) : (
                  <div css={baphStyles.noPosterPlaceholder}>No Poster</div>
                )}
              </div>

              <div css={baphStyles.movieDetails}>
                <h3 css={baphStyles.movieTitle}>{movie.title}</h3>

                <div css={baphStyles.movieMeta}>
                  <div css={baphStyles.metaItem}>
                    <strong>Release Date:</strong>{' '}
                    {movie.releaseDate || 'Unknown'}
                  </div>
                  <div css={baphStyles.metaItem}>
                    <strong>TMDB ID:</strong> {movie.id}
                  </div>
                </div>

                <p css={baphStyles.movieOverview}>
                  {movie.overview || 'No overview available.'}
                </p>

                <div css={baphStyles.movieActions}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleSelectMovie(movie.id)}
                    className={{ button: baphStyles.selectButton }}
                  >
                    Select Movie
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  modalContent: {
    maxHeight: '70vh',
    overflowY: 'auto' as const
  },
  modalDescription: {
    color: baseColors.primary[500],
    marginBottom: '20px',
    fontSize: '16px',
    textAlign: 'center' as const
  },
  movieResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  movieResultItem: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: baseColors.secondary[700],
    border: `1px solid ${baseColors.tertiary[600]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: baseColors.secondary[600],
      borderColor: baseColors.tertiary[500],
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }
  },
  moviePoster: {
    flexShrink: 0,
    width: '80px',
    height: '120px',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  posterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  noPosterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: baseColors.secondary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: baseColors.tertiary[400],
    fontSize: '12px',
    textAlign: 'center' as const,
    border: `1px solid ${baseColors.tertiary[500]}`
  },
  movieDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  movieTitle: {
    margin: 0,
    color: baseVibrantColors.primary[300],
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.3'
  },
  movieMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
    fontSize: '14px'
  },
  metaItem: {
    color: baseColors.tertiary[300],
    '& strong': {
      color: baseColors.tertiary[100],
      marginRight: '5px'
    }
  },
  movieOverview: {
    color: baseColors.tertiary[200],
    fontSize: '14px',
    lineHeight: '1.4',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  selectButton: {
    alignSelf: 'flex-start',
    marginTop: '10px'
  },
  movieActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px'
  },
  existingMovieMessage: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    color: baseVibrantColors.accent[300]
  },
  updateButton: {
    marginLeft: '10px'
  }
};
