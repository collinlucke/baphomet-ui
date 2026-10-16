import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { Modal } from 'athameui';
import { TMDB_MOVIE_IMAGES } from '../../api/queries';

type ImageKind = 'poster' | 'backdrop';

type TmdbMovieImages = {
  posters: string[];
  backdrops: string[];
};

type AddMovieImageModalProps = {
  isOpen: boolean;
  kind: ImageKind;
  tmdbId?: string | number;
  selectedPath?: string;
  onClose: () => void;
  onSelect: (filePath: string) => void;
};

export const AddMovieImageModal = ({
  isOpen,
  kind,
  tmdbId,
  selectedPath,
  onClose,
  onSelect
}: AddMovieImageModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchImages, { loading }] = useLazyQuery<{
    tmdbMovieImages: TmdbMovieImages;
  }>(TMDB_MOVIE_IMAGES);

  useEffect(() => {
    if (!isOpen) return;

    if (tmdbId == null || tmdbId === '') {
      setImages([]);
      setErrorMessage(
        'This movie needs a TMDB ID before images can be loaded.'
      );
      return;
    }

    let cancelled = false;
    setErrorMessage('');
    setImages([]);

    fetchImages({ variables: { tmdbId: String(tmdbId) } })
      .then(result => {
        if (cancelled) return;
        const set = result.data?.tmdbMovieImages;
        setImages(
          kind === 'poster' ? (set?.posters ?? []) : (set?.backdrops ?? [])
        );
      })
      .catch(() => {
        if (!cancelled) setErrorMessage('Could not load images from TMDB.');
      });

    return () => {
      cancelled = true;
    };
  }, [fetchImages, isOpen, kind, tmdbId]);

  const title = kind === 'poster' ? 'Choose a poster' : 'Choose a backdrop';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div css={baphStyles.content}>
        {loading && <p>Loading images from TMDB...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!loading && !errorMessage && images.length === 0 && (
          <p>TMDB did not return any {kind}s for this movie.</p>
        )}
        <div
          css={
            kind === 'poster' ? baphStyles.posterGrid : baphStyles.backdropGrid
          }
        >
          {images.map(filePath => (
            <button
              key={filePath}
              type="button"
              css={[
                baphStyles.option,
                filePath === selectedPath && baphStyles.selected
              ]}
              onClick={() => {
                onSelect(filePath);
                onClose();
              }}
            >
              <img
                alt=""
                css={
                  kind === 'poster' ? baphStyles.poster : baphStyles.backdrop
                }
                src={`https://image.tmdb.org/t/p/${kind === 'poster' ? 'w185' : 'w300'}${filePath}`}
              />
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
    overflow: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  posterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 2fr))',
    gap: '12px'
  },
  backdropGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px'
  },
  option: {
    padding: 0,
    border: '2px solid transparent',
    background: 'transparent',
    cursor: 'pointer'
  },
  selected: {
    borderColor: 'var(--color-primary-vibrant-500)'
  },
  poster: {
    width: '100%',
    display: 'block'
  },
  backdrop: {
    width: '100%',
    display: 'block'
  }
};
