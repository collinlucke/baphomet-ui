import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { GET_MOVIE } from '../../api/queries';
// import { ADD_MOVIE, UPDATE_MOVIE } from '../../api/mutations';
import { Form } from '@collinlucke/phantomartist';

type MovieDataProps = {
  getMovie: {
    id?: string;
    title?: string;
    rated?: string;
    year?: number;
    poster?: string;
  };
};

// type MovieDataProps = {
//   getMovie: MovieDataProps;
// };

export const MovieEditor: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const [form, setForm] = useState<MovieDataProps>({
    getMovie: {
      id: '',
      title: '',
      year: 0,
      rated: '',
      poster: ''
    }
  });
  console.log(form, location, useMutation, useEffect);

  const {} = useQuery(GET_MOVIE, {
    variables: { id: params.id },
    skip: !params.id,
    onCompleted: (data: MovieDataProps) => {
      console.log(data);
      const { id, title, year, rated, poster } = data.getMovie;
      setForm({ getMovie: { id, title, year, rated, poster } });
    }
  });

  // const [addMovie] = useMutation(ADD_MOVIE, {
  //   variables: {
  //     id: form.id,
  //     title: form.title,
  //     year: Number(form.year),
  //     rated: form.rated,
  //     poster: form.poster
  //   }
  // });

  // const [updateMovie] = useMutation(UPDATE_MOVIE, {
  //   variables: {
  //     id: form.id,
  //     title: form.title,
  //     year: Number(form.year),
  //     rated: form.rated,
  //     poster: form.poster
  //   }
  // });

  // Resets form if coming from the `edit` page. Without this, going to the `create` page will carry
  // over the data from the `edit` page
  // useEffect(() => {
  //   if (location.pathname === '/create') {
  //     setForm({ id: '', title: '', year: 0, rated: '' });
  //   }
  // }, [location.pathname]);

  // const updateForm = <T,>(val: T): void => {
  //   return setForm(prev => {
  //     return { ...prev, ...val };
  //   });
  // };

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!params.id) {
  //     addMovie();
  //   } else {
  //     updateMovie();
  //   }
  // };
  // console.log(onSubmit);

  // TODO: Rip out form and replace with new form from PhantomArtist
  return (
    <>
      <Form>Here Be Yer Form</Form>
    </>
  );
};
