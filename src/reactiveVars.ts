import { makeVar } from '@apollo/client';
import {
  CustomErrorTypes,
  GetAllMoviesQueryVarsObject
} from './types/CustomTypes.types';
import { MovieType } from './Pages/MovieList/MovieListPage.tsx';

export const isAuthenticatedVar = makeVar(false);
export const errorVar = makeVar<CustomErrorTypes | undefined>(undefined);
export const showHeadingVar = makeVar(true);
export const scrollLimitVar = makeVar(20);
export const searchTermVar = makeVar<string | undefined>(undefined);
export const cursorVar = makeVar('');
export const endOfResultsVar = makeVar(false);
export const getAllMoviesQueryVar = makeVar<
  ((variables: GetAllMoviesQueryVarsObject) => void) | null
>(null);
export const totalMovieCountVar = makeVar('');
export const moviesListVar = makeVar<MovieType[] | null>([]);
