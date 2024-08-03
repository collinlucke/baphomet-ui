import { List } from '@crazy-overlord/phantomartist';
import { MovieListItem } from './MovieListItem';

type Movie = {
  id: string;
  title?: string;
  year?: number;
  rated?: string;
  poster?: string;
};

type MovieData = {
  movieData: {
    getAllMovies: Movie[];
  };
};

export const MovieList: React.FC<MovieData> = ({ movieData }) => {
  return (
    <List>
      {movieData.getAllMovies.map(mov => (
        <MovieListItem mov={mov} key={mov.id} />
      ))}
    </List>
  );
};
