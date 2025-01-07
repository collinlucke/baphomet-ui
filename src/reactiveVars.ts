import { makeVar } from '@apollo/client';
import { CustomErrorTypes } from './CustomTypes.types';

export const isAuthenticatedVar = makeVar(false);
export const errorVar = makeVar<CustomErrorTypes | undefined>(undefined);
export const showHeadingVar = makeVar(true);
