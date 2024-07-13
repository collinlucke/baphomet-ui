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
  const tdClassName = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0';

  // const deleteMovieHandler = () => {
  //   deleteMovie(_id);
  // };

  return (
    <tr className="border-b transition-color hover:bg-muted/50 data-[state=selected:bg-muted">
      <td className={tdClassName}>{title}</td>
      <td className={tdClassName}>{year}</td>
      <td className={tdClassName}>{rated}</td>
      <td>
        <div className="flex gap-2">
          <Link
            to={`/edit/${id}`}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          >
            Edit
          </Link>
          <button
            color="red"
            type="button"
            // onClick={deleteMovieHandler}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
