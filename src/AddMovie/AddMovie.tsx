import React, { useState } from 'react';

interface Movie {
  name: string;
  director: string;
  releaseDate: string;
  mpaRating: string;
}

const AddMovie: React.FC = () => {
  // const [movie, setMovie] = useState<Movie>({
  //   name: '',
  //   director: '',
  //   releaseDate: '',
  //   mpaRating: ''
  // });

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMovie({ ...movie, [event.target.name]: event.target.value });
  // };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   await fetchMovies(movie);
  //   setMovie({
  //     name: '',
  //     director: '',
  //     releaseDate: '',
  //     mpaRating: ''
  //   });
  // };

  return (
    <>
      Gutted for now. A phantom will come...
      <br></br>
      <br></br>
      <br></br>; That was really stupid. I'll show myself out.
    </>
  );
};

export default AddMovie;
