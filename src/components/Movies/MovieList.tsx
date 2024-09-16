import { List } from '@collinlucke/phantomartist';
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
    allMovies: Movie[];
  };
};

export const MovieList: React.FC<MovieData> = ({ movieData }) => {
  // console.log(movieData);
  return (
    <List>
      {movieData.allMovies.map(mov => (
        <MovieListItem mov={mov} key={mov.id} />
      ))}
    </List>
  );
};
