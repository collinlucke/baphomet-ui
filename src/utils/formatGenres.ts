import type { Genre } from '../types/movies.types';

export const formatGenres = (genres?: Array<Genre | string> | null): string =>
  (genres ?? [])
    .map(g => (typeof g === 'string' ? g : (g?.genre ?? '')))
    .filter(Boolean)
    .join(', ');
