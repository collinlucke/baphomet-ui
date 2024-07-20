import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { GET_MOVIE } from './queries';
import { ADD_MOVIE, UPDATE_MOVIE } from './mutations';
import { Form } from '@crazy-overlord/phantomartist';

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
  console.log(onSubmit, updateForm);

  // TODO: Rip out form and replace with new form from PhantomArtist
  return (
    <>
      <Form>Here Be Yer Form</Form>
    </>
  );
};
