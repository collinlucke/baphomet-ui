import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { GET_MOVIE } from './queries';
import { ADD_MOVIE, UPDATE_MOVIE } from './mutations';

type MovieObject = {
  id?: string;
  title: string;
  rated?: string;
  year?: number;
  poster?: string;
};

export const MovieEditor: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const [form, setForm] = useState<MovieObject>({
    id: '',
    title: '',
    year: 0,
    rated: '',
    poster: ''
  });

  useQuery(GET_MOVIE, {
    variables: { id: params.id },
    skip: !params.id,
    onCompleted: data => {
      const { id, title, year, rated } = data.getMovie;
      setForm({ id, title, year, rated });
    }
  });

  const [addMovie] = useMutation(ADD_MOVIE, {
    variables: {
      id: form.id,
      title: form.title,
      year: Number(form.year),
      rated: form.rated,
      poster: form.poster
    }
  });

  const [updateMovie] = useMutation(UPDATE_MOVIE, {
    variables: {
      id: form.id,
      title: form.title,
      year: Number(form.year),
      rated: form.rated,
      poster: form.poster
    }
  });

  // Resets form if coming from the `edit` page. Without this, going to the `create` page will carry
  // over the data from the `edit` page
  useEffect(() => {
    if (location.pathname === '/create') {
      setForm({ id: '', title: '', year: 0, rated: '' });
    }
  }, [location.pathname]);

  const updateForm = <T,>(val: T): void => {
    return setForm(prev => {
      return { ...prev, ...val };
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      addMovie();
    } else {
      updateMovie();
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Movie</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Movie Poster
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <input type="file" id="myFile" name="filename" />
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Movie Title"
                    value={form.title}
                    onChange={e => updateForm({ title: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="year"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Year
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="number"
                    name="year"
                    id="year"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Year Released"
                    value={form.year}
                    onChange={e => updateForm({ year: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <fieldset className="mt-4 ">
                <legend className="block text-sm font-medium leading-6 text-slate-900">
                  MPA
                </legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="ratedTVG"
                      name="ratedOptions"
                      type="radio"
                      value="TV-G"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.rated === 'TV-G'}
                      onChange={e => updateForm({ rated: e.target.value })}
                    />
                    <label
                      htmlFor="ratedTVG"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      TV-G
                    </label>
                    <input
                      id="ratedG"
                      name="ratedOptions"
                      type="radio"
                      value="G"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.rated === 'G'}
                      onChange={e => updateForm({ rated: e.target.value })}
                    />
                    <label
                      htmlFor="ratedG"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      G
                    </label>
                    <input
                      id="ratedPG"
                      name="ratedOptions"
                      type="radio"
                      value="PG"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.rated === 'PG'}
                      onChange={e => updateForm({ rated: e.target.value })}
                    />
                    <label
                      htmlFor="ratedPG"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      PG
                    </label>
                    <input
                      id="ratedPG13"
                      name="ratedOptions"
                      type="radio"
                      value="PG-13"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.rated === 'PG-13'}
                      onChange={e => updateForm({ rated: e.target.value })}
                    />
                    <label
                      htmlFor="ratedPG13"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      PG-13
                    </label>

                    <input
                      id="ratedR"
                      name="ratedOptions"
                      type="radio"
                      value="R"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.rated === 'R'}
                      onChange={e => updateForm({ rated: e.target.value })}
                    />
                    <label
                      htmlFor="ratedR"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      R
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Movie Info"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
};
