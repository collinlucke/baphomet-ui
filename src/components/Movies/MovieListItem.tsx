import { ListItem, PANavLink } from '@collinlucke/phantomartist';
import * as stylex from '@stylexjs/stylex';

type MovieType = {
  id: string;
  poster?: string;
  year?: number;
  rated?: string;
  title?: string;
};

export const MovieListItem = ({ mov }: { mov: MovieType }) => {
  const { id, year, title } = mov;

  return (
    <ListItem useHover>
      <PANavLink to={`/edit/${id}`}>
        <div id={id} {...stylex.props(baphStyles.wrapper)}>
          <span {...stylex.props(baphStyles.title)}>{title}</span>
          <span>{year} </span>
        </div>
      </PANavLink>
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
