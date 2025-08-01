import { Link } from 'react-router-dom';
import { Delete02Icon } from 'hugeicons-react';
import { Button, ListItem } from '@collinlucke/phantomartist';
import { useState } from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useReactiveVar } from '@apollo/client';
import { isAuthenticatedVar } from '../../reactiveVars';

type MovieType = {
  id: string;
  poster?: string;
  releaseDate?: string;
  rated?: string;
  title: string;
};

type OpenDeleteModalType = ({
  id,
  title
}: {
  id: string;
  title: string;
}) => void;

export const MovieListItem: React.FC<{
  mov: MovieType;
  openDeleteModal: OpenDeleteModalType;
}> = ({
  mov,
  openDeleteModal
}: {
  mov: MovieType;
  openDeleteModal: OpenDeleteModalType;
}) => {
  const [showTrashSolid, setShowTrashSolid] = useState(false);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const screenSize = useScreenSize();
  const { id, releaseDate, title } = mov;

  const handleMouseEnter = () => {
    setShowTrashSolid(true);
  };

  const handleMouseLeave = () => {
    setShowTrashSolid(false);
  };

  const openDeleteModalHandler = () => {
    openDeleteModal({ id: mov.id, title: mov.title });
  };

  return (
    <ListItem className={{ li: baphStyles.li(screenSize) }} useHover>
      <>
        <Link to={`/view/${id}`} style={baphStyles.wrapper(screenSize)}>
          <span css={[baphStyles.title]}>{title}</span>
          {releaseDate && (
            <span css={[baphStyles.releaseDate(screenSize)]}>
              {releaseDate}
            </span>
          )}
        </Link>
        {isAuthenticated && (
          <Button
            kind="ghost"
            iconOnly
            onClick={openDeleteModalHandler}
            className={{ button: baphStyles.button(screenSize) }}
          >
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {showTrashSolid ? (
                <Delete02Icon fill="silver" size={20} />
              ) : (
                <Delete02Icon size={20} />
              )}
            </div>
          </Button>
        )}
      </>
    </ListItem>
  );
};

const baphStyles = {
  wrapper: (size: string) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: size === 'small' ? 'start' : 'center',
    flex: 1,
    flexDirection: size === 'small' ? ('column' as const) : ('row' as const),
    gap: size === 'small' ? '0' : '20px'
  }),
  title: {
    WebkitBoxOrient: 'vertical' as const,
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  releaseDate: (size: string) => ({
    marginRight: '20px',
    minWidth: 'max-content',
    textAlign: 'right' as const,
    fontSize: size === 'small' ? '.8em' : 'inherit'
  }),
  button: (size: string) => ({
    alignItems: size === 'small' ? 'center' : 'start',
    minWidth: 'max-content'
  }),
  li: (size: string) => ({
    gap: size === 'small' ? '20px' : '0'
  })
};
