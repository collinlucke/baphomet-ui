import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from './queries';
import { useState } from 'react';
import { List, ListItem } from '@crazy-overlord/phantomartist';

type Movie = {
  id: string;
  title?: string;
  year?: number;
  rated?: string;
};

type MovieData = {
  getAllMovies: Movie[];
};

export const MovieList: React.FC<Movie> = () => {
  const [movieData, setMovieData] = useState<MovieData>({ getAllMovies: [] });

  const { loading, error } = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 50 // TODO: Hard coded until I get around to making a thingy to put put in a custom value
    },
    onCompleted: data => {
      setMovieData(data);
    }
  });

  return (
    <div>
      <List>
        {movieData.getAllMovies.map(mov => (
          // Ignore warning: key is being set on the li in the ListItem component
          <ListItem id={mov.id}>
            <div>{mov.title}</div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
