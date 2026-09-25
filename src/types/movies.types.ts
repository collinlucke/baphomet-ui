export type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  rated?: string;
  posterPath?: string;
  winningPercentage: number;
  overview?: string;
  genres?: string[];
  revenue?: number;
  backdropPath?: string;
  tmdbId: string;
};
