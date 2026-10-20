import { makeVar } from '@apollo/client';
import { CurrentMovie } from '../../types/movies.types';

export const currentMovieVar = makeVar({} as CurrentMovie);
export const isExistingMovieVar = makeVar(false);
export const isMovieLoadingVar = makeVar(false);
