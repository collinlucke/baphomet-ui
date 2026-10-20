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

export type ProfileImages = {
  w185?: string;
};

export type CastCredit = {
  personId: number;
  character?: string;
  order?: number;
  name?: string;
  profilePath?: string;
  profileImages?: ProfileImages;
  __typename?: string;
};

export type CrewCredit = {
  personId: number;
  job?: string;
  department?: string;
  name?: string;
  profilePath?: string;
  profileImages?: ProfileImages;
  __typename?: string;
};

export type MovieCertification = {
  country?: string;
  rating?: string;
  releaseDate?: string;
};

export type MovieVideo = {
  name?: string;
  site?: string;
  key?: string;
  type?: string;
  official?: boolean;
};

export type CurrentMovie = {
  id?: string | undefined;
  title?: string | undefined;
  releaseDate?: string | undefined;
  mpaRating?: string | undefined;
  genres?: Genre[] | undefined;
  overview?: string | undefined;
  posterPath?: string | undefined;
  backdropPath?: string | undefined;
  tmdbId?: number | string | undefined;
  imdbId?: string;
  originalTitle?: string;
  originalLanguage?: string;
  homepage?: string;
  status?: string;
  runtime?: number | null;
  budget?: number | null;
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
  adult?: boolean;
  spokenLanguages?: string[];
  productionCompanies?: string[];
  productionCountries?: string[];
  originCountries?: string[];
  keywords?: string[];
  logoPath?: string;
  posterPaths?: string[];
  backdropPaths?: string[];
  certifications?: MovieCertification[];
  videos?: MovieVideo[];
  revenue?: number | string | undefined;
  tagline?: string | undefined;
  cast?: CastCredit[] | undefined;
  crew?: CrewCredit[] | undefined;
};

export type PossibleMovieMatch = {
  id: string;
  tmdbId: string;
  title: string;
  releaseDate: string;
  mpaRating: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  results?: PossibleMovieMatch[];
};

export type PossibleMovieMatchResponse = {
  possibleMatches: PossibleMovieMatch[];
  totalCount: number;
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
    budget: number;
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
      profileImages?: ProfileImages;
    }[];
    crew?: {
      personId: number;
      job?: string;
      department?: string;
      name?: string;
      profilePath?: string;
      profileImages?: ProfileImages;
    }[];
    tagline?: string;
  };
};

export type AddMovieData = {
  addMovie: CurrentMovie;
};

export type UpdateMovieData = {
  updateMovie: CurrentMovie;
};

export type ExistingMovieData = {
  movieResult: {
    found: boolean;
    errorMessage: string;
    movie: CurrentMovie | undefined;
  };
};
