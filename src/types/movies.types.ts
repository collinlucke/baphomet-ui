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

export type Director = {
  id: number;
  name: string;
  profilePath?: string;
};

export type Genre = {
  id: string;
  genre: string;
};

export type MovieDetailsResponse = {
  movieResults: {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
    genres: Genre[];
    posterPath: string;
    backdropPath: string;
    posterImages?: {
      w92?: string;
      w154?: string;
      w185?: string;
      w342?: string;
      w500?: string;
      w780?: string;
      original?: string;
    };
    backdropImages?: {
      w92?: string;
      w154?: string;
      w185?: string;
      w342?: string;
      w500?: string;
      w780?: string;
      original?: string;
    };
    rated?: string;
    revenue?: number;
    tmdbId: string;
    winningPercentage: number;
    totalWins: number;
    totalLosses: number;
    totalComparisons: number;
    addedBy: string;
    lastUpdated: string;
    createdAt: string;
    mpaRating?: string;
    cast?: {
      personId: number;
      character?: string;
      order?: number;
      name?: string;
      profilePath?: string;
    }[];
    crew?: {
      personId: number;
      job?: string;
      department?: string;
      name?: string;
      profilePath?: string;
    }[];
    tagline?: string;
  };
};
