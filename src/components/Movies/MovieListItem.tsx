import { NavLink } from 'react-router-dom';
import { ListItem } from '@crazy-overlord/phantomartist';
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
    <ListItem>
      <NavLink to={`/edit/${id}`}>
        <div id={id} {...stylex.props(baphStyles.wrapper)}>
          <span {...stylex.props(baphStyles.title)}>{title}</span>
          <span {...stylex.props(baphStyles.year)}>Year Released: {year} </span>
        </div>
      </NavLink>
    </ListItem>
  );
};

const baphStyles = stylex.create({
  title: {
    width: '300px',
    WebkitBoxOrient: 'vertical',
    display: '-webkit-inline-box',
    overflow: 'hidden',
    WebkitLineClamp: '1'
  },
  year: {
    paddingRight: '40px'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});
