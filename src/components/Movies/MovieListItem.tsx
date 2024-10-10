/** @jsxImportSource @emotion/react */
import { ListItem } from '@collinlucke/phantomartist';

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
      <div id={id} css={[baphStyles.wrapper]}>
        <span css={[baphStyles.title]}>{title}</span>
        <span>{releaseDate}</span>
      </div>
    </ListItem>
  );
};

const baphStyles = {
  title: {
    width: '350px',
    WebkitBoxOrient: 'vertical' as 'vertical',
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};
