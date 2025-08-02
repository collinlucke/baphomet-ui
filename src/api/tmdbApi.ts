export const searchByMovieTitle = async (title: string) => {
  // Vite exposes env vars as import.meta.env
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  // console.log(title);
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
};

export const getMovieByTMDBId = async (tmdbId: number) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US&api_key=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movie');
  }
  return response.json();
};
