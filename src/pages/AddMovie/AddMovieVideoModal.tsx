import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { Modal } from 'athameui';
import { FETCH_MOVIE_FROM_TMDB } from '../../api/queries';
import type { MovieVideo } from '../../types/movies.types';

type AddMovieVideoModalProps = {
  isOpen: boolean;
  tmdbId?: string | number;
  selectedKey?: string;
  onClose: () => void;
  onSelect: (video: MovieVideo) => void;
};

export const AddMovieVideoModal = ({
  isOpen,
  tmdbId,
  selectedKey,
  onClose,
  onSelect
}: AddMovieVideoModalProps) => {
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchMovie, { loading }] = useLazyQuery<{
    fetchedMovie: { videos?: MovieVideo[] };
  }>(FETCH_MOVIE_FROM_TMDB);

  useEffect(() => {
    if (!isOpen) return;

    if (tmdbId == null || tmdbId === '') {
      setVideos([]);
      setErrorMessage(
        'This movie needs a TMDB ID before trailers can be loaded.'
      );
      return;
    }

    let cancelled = false;
    setErrorMessage('');
    setVideos([]);

    fetchMovie({ variables: { tmdbId: String(tmdbId) } })
      .then(result => {
        if (cancelled) return;
        setVideos(result.data?.fetchedMovie?.videos ?? []);
      })
      .catch(() => {
        if (!cancelled) setErrorMessage('Could not load trailers from TMDB.');
      });

    return () => {
      cancelled = true;
    };
  }, [fetchMovie, isOpen, tmdbId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a trailer">
      <div css={baphStyles.content}>
        {loading && <p>Loading trailers from TMDB...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!loading && !errorMessage && videos.length === 0 && (
          <p>TMDB did not return any trailers for this movie.</p>
        )}
        <div css={baphStyles.grid}>
          {videos.map(video => (
            <button
              key={video.key}
              type="button"
              css={[
                baphStyles.option,
                video.key === selectedKey && baphStyles.selected
              ]}
              onClick={() => {
                onSelect(video);
                onClose();
              }}
            >
              {video.key && (
                <img
                  alt=""
                  css={baphStyles.thumbnail}
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                />
              )}
              <span css={baphStyles.name}>{video.name || 'Untitled'}</span>
              <span css={baphStyles.meta}>
                {[video.type, video.official ? 'Official' : '']
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  content: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '70vh',
    overflow: 'auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px'
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    border: '2px solid transparent',
    background: 'transparent',
    color: 'inherit',
    textAlign: 'left',
    cursor: 'pointer'
  },
  selected: {
    borderColor: 'var(--color-primary-vibrant-500)'
  },
  thumbnail: {
    width: '100%',
    display: 'block'
  },
  name: {
    fontWeight: 600
  },
  meta: {
    opacity: 0.75
  }
};
