import { ListItem } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { Trash, TrashSolid, IconoirProvider } from 'iconoir-react';
import { Button } from '@collinlucke/phantomartist';
import { useState, MouseEventHandler } from 'react';

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
  const { id, releaseDate, title } = mov;

  const mouseTrashHoverHandler: MouseEventHandler<HTMLDivElement> = e => {
    if (e.type === 'mouseenter') {
      setShowTrashSolid(true);
    } else {
      setShowTrashSolid(false);
    }
  };

  const openDeleteModalHandler = () => {
    openDeleteModal({ id: mov.id, title: mov.title });
  };

  return (
    <ListItem useHover>
      <>
        <Link to={`/view/${id}`} style={baphStyles.wrapper}>
          <span css={[baphStyles.title]}>{title}</span>
          {releaseDate && (
            <span css={[baphStyles.releaseDate]}>{releaseDate}</span>
          )}
        </Link>
        <Button kind="ghost" iconOnly onClick={openDeleteModalHandler}>
          <div
            onMouseEnter={mouseTrashHoverHandler}
            onMouseLeave={mouseTrashHoverHandler}
          >
            <IconoirProvider iconProps={{ height: '1.2rem' }}>
              {showTrashSolid ? <TrashSolid /> : <Trash />}
            </IconoirProvider>
          </div>
        </Button>
      </>
    </ListItem>
  );
};

const baphStyles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1
  },
  title: {
    maxWidth: '550px',
    minWidth: '200px',
    WebkitBoxOrient: 'vertical' as 'vertical',
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  releaseDate: {
    marginLeft: '20px',
    marginRight: '20px',
    minWidth: '120px',
    textAlign: 'right' as 'right'
  }
};
