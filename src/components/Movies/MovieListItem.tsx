import { ListItem } from '@collinlucke/phantomartist';
import * as stylex from '@stylexjs/stylex';

type MovieType = {
  id: string;
  poster?: string;
  releaseDate?: string;
  rated?: string;
  title?: string;
};

export const MovieListItem = ({ mov }: { mov: MovieType }) => {
  const { id, releaseDate, title } = mov;

  return (
    <ListItem useHover>
      <div id={id} {...stylex.props(baphStyles.wrapper)}>
        <span {...stylex.props(baphStyles.title)}>{title}</span>
        <span>{releaseDate}</span>
      </div>
    </ListItem>
  );
};

const baphStyles = stylex.create({
  title: {
    width: '350px',
    WebkitBoxOrient: 'vertical',
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});
