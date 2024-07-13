import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from './queries';
import { MovieListItem } from './MovieListItem';
import { useState } from 'react';

type Movie = {
  id: string;
  title: string;
  year: number;
  rated: string;
};

type MovieData = {
  getAllMovies: Movie[];
};

export const MovieList: React.FC<Movie> = () => {
  const [movieData, setMovieData] = useState<MovieData>({ getAllMovies: [] });
  const { loading, error } = useQuery(GET_ALL_MOVIES, {
    variables: {
      limit: 50
    },
    onCompleted: data => {
      console.log(data);
      setMovieData(data);
    }
  });

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Movies</h3>
      <div className="border rounded-lg overflow-hidden">
        {error && <p>Error: {error.message}</p>}
        {loading && <p> Loading.........</p>}
        {!loading && (
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
                {movieData?.getAllMovies.map(mov => {
                  return <MovieListItem movie={mov} key={mov.id} />;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
