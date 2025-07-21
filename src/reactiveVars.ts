import { makeVar } from '@apollo/client';
import { CustomErrorTypes } from './types/CustomTypes.types.ts';
import { MovieType } from './Pages/MovieList/MovieListPage';

export const isAuthenticatedVar = makeVar(false);
export const errorVar = makeVar<CustomErrorTypes | undefined>(undefined);
export const showHeadingVar = makeVar(true);
export const scrollLimitVar = makeVar(20);
export const searchTermVar = makeVar<string | number | undefined>(undefined);
export const cursorVar = makeVar('');
export const endOfResultsVar = makeVar(false);
export const getAllMoviesQueryVar = makeVar<Function>(() => {});
export const totalMovieCountVar = makeVar('');
export const moviesListVar = makeVar<MovieType[] | null>([]);
