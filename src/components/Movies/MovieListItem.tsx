/** @jsxImportSource @emotion/react */
import { ListItem } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';

type MovieType = {
  id: string;
  poster?: string;
  releaseDate?: string;
  rated?: string;
  title?: string;
};

export const MovieListItem: React.FC<{ mov: MovieType }> = ({
  mov
}: {
  mov: MovieType;
}) => {
  const { id, releaseDate, title } = mov;

  return (
    <ListItem useHover>
      <Link to={`/view/${id}`}>
        <div id={id} css={[baphStyles.wrapper]}>
          <span css={[baphStyles.title]}>{title}</span>
          <span css={[baphStyles.releaseDate]}>{releaseDate}</span>
        </div>
      </Link>
    </ListItem>
  );
};

const baphStyles = {
  title: {
    maxWidth: '350px',
    minWidth: '200px',
    WebkitBoxOrient: 'vertical' as 'vertical',
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  releaseDate: {
    marginLeft: '20px',
    marginRight: '20px',
    minWidth: '120px',
    textAlign: 'right' as 'right'
  }
};
