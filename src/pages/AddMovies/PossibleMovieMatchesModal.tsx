import { CSSObject } from '@emotion/react';
import { tokens, Button, Modal } from 'athameui';
import type { PossibleMovieMatch } from './AddMoviesPage';

const { color } = tokens;

type PossibleMovieMatchesProps = {
  possibleMatches: PossibleMovieMatch[];
  showModal: boolean;
  handleCloseModal: () => void;
  selectMovieHandler: (tmdbId: number) => void;
};

export const PossibleMovieMatchesModal = ({
  possibleMatches,
  selectMovieHandler,
  showModal,
  handleCloseModal
}: PossibleMovieMatchesProps) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title="Search Results"
      dataTestId="movie-search-modal"
      sx={{ modal: baphStyles.modal }}
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
                    <strong>TMDB ID:</strong> {movie.tmdbId}
                  </div>
                </div>

                <p css={baphStyles.movieOverview}>
                  {movie.overview || 'No overview available.'}
                </p>

                <div css={baphStyles.movieActions}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => selectMovieHandler(movie.tmdbId)}
                    sx={{ button: baphStyles.selectButton }}
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
  modal: {
    maxWidth: '800px'
  },
  modalContent: {
    maxHeight: '70vh',
    overflowY: 'auto' as const
  },
  modalDescription: {
    color: color.primary[500],
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
    backgroundColor: color.secondary[700],
    border: `1px solid ${color.tertiary[600]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: color.secondary[600],
      borderColor: color.tertiary[500],
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
    backgroundColor: color.secondary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color.tertiary[400],
    fontSize: '12px',
    textAlign: 'center' as const,
    border: `1px solid ${color.tertiary[500]}`
  },
  movieDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  movieTitle: {
    margin: 0,
    color: color.primary[300],
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
    color: color.tertiary[300],
    '& strong': {
      color: color.tertiary[100],
      marginRight: '5px'
    }
  },
  movieOverview: {
    color: color.tertiary[200],
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
    color: color.error.vibrant[300]
  },
  updateButton: {
    marginLeft: '10px'
  }
};
