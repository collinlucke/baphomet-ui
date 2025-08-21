export const createMovieListItemMock = () => ({
  MovieListItem: ({
    movie,
    openMovieDetails
  }: {
    movie: {
      id: string;
      title: string;
      winningPercentage: number;
      tmdbId: string;
    };
    openMovieDetails: (tmdbId: string) => void;
  }) => (
    <li data-testid={`movie-item-${movie.id}`}>
      <span>{movie.title}</span>
      <span data-testid={`winning-percentage-${movie.id}`}>
        {movie.winningPercentage}%
      </span>
      <button
        data-testid={`details-button-${movie.id}`}
        onClick={() => openMovieDetails(movie.tmdbId)}
      >
        Details
      </button>
    </li>
  )
});
