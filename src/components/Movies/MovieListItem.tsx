import { Link } from 'react-router-dom';

type MovieProps = {
  movie: {
    title: string;
    year: number;
    rated: string;
    id: string;
  };
};
export const MovieListItem: React.FC<MovieProps> = ({ movie }) => {
  const { title, year, rated, id } = movie;

  // TODO: Reinstate this
  // const deleteMovieHandler = () => {
  //   deleteMovie(_id);
  // };

  // TODO: Replace this UI with PhantomArtist... maybe rename from '-ui' to '-client' as most of the
  // actual UI is over there

  return <>It'll be back.</>;
};
