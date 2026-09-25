import { makeVar } from '@apollo/client';
import { CurrentMovie } from './AddMoviesPage';

export const currentMovieVar = makeVar({} as CurrentMovie);
export const isExistingMovieVar = makeVar(false);
export const isMovieLoadingVar = makeVar(false);
