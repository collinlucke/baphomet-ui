import { makeVar } from '@apollo/client';
import {
  CustomErrorTypes,
  GetMoviesByTitleQueryVarsObject
} from './types/CustomTypes.types';

export const isAuthenticatedVar = makeVar(false);
export const showUnauthorizedModalVar = makeVar(false);
export const showFeedbackModalVar = makeVar(false);
export const errorVar = makeVar<CustomErrorTypes | undefined>(undefined);
export const showHeadingVar = makeVar(true);
export const scrollLimitVar = makeVar(20);
export const searchTermVar = makeVar<string | undefined>(undefined);
export const cursorVar = makeVar('');
export const endOfResultsVar = makeVar(false);
export const getMoviesByTitleQueryVar = makeVar<
  ((variables: GetMoviesByTitleQueryVarsObject) => void) | null
>(null);
export const totalMovieCountVar = makeVar('');
export const isMobileVar = makeVar(false);
export const isLandscapeVar = makeVar(false);
export const isMobileAndLandscapeVar = makeVar(false);
