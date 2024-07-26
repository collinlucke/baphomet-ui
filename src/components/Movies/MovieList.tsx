import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../../api/queries';
import { List, ListItem } from '@crazy-overlord/phantomartist';
import { MovieListItem } from './MovieListItem';
import { colors } from '../../styling/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

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
    <>
      <List className={baseStyles.colors}>
        {movieData.getAllMovies.map(mov => (
          // Ignore warning: key is being set on the li in the ListItem component
          <MovieListItem mov={mov} />
        ))}
      </List>
    </>
  );
};

const baseStyles = stylex.create({
  colors: {
    color: {
      default: colors.primaryColor,
      ':hover': colors.secondaryColor
    }
  }
});
