import { makeVar } from '@apollo/client';
import { CustomErrorTypes } from './CustomTypes.types';

export const isAuthenticatedVar = makeVar(false);
export const errorVar = makeVar<CustomErrorTypes | undefined>(undefined);
export const showHeadingVar = makeVar(true);
export const scrollLimitVar = makeVar(20);
export const searchTermVar = makeVar('');
export const cursorVar = makeVar('');
export const endOfResultsVar = makeVar(false);
export const getAllMoviesQueryVar = makeVar<Function>(() => {});
export const totalMovieCountVar = makeVar('');
