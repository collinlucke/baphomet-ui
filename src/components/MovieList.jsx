import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Movie = ({ movie, deleteMovie }) => {
  const { title, year, rated, _id } = movie;
  const tdClassName = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0';

  const deleteMovieHandler = () => {
    deleteMovie(_id);
  };

  return (
    <tr className="border-b transition-color hover:bg-muted/50 data-[state=selected:bg-muted">
      <td className={tdClassName}>{title}</td>
      <td className={tdClassName}>{year}</td>
      <td className={tdClassName}>{rated}</td>
      <td>
        <div className="flex gap-2">
          <Link
            to={`/edit/${_id}`}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          >
            Edit
          </Link>
          <button
            color="red"
            type="button"
            onClick={deleteMovieHandler}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5050/movies`);
        const movies = await response.json();
        setMovies(movies);
      } catch (err) {
        const message = `An error occurred: ${err.message}`;
        console.error(message);
        return;
      }
    };
    getMovies();
  }, [movies.length]);

  const deleteMovie = async id => {
    try {
      await fetch(`http://localhost:5050/movies/${id}`, {
        method: 'DELETE'
      });
      const newMovies = movies.filter(mov => {
        return mov._id !== id;
      });
      setMovies(newMovies);
    } catch (err) {
      const message = `An error occurred: ${err.message}`;
      console.error(message);
      return;
    }
  };

  const movieList = () => {
    return movies.map(mov => {
      return <Movie movie={mov} deleteMovie={deleteMovie} key={mov._id} />;
    });
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Movies</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Year
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Rated
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {movieList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MovieList;
