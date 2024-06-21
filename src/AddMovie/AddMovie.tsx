import React, { useState } from "react";
import { TextField, Select, MenuItem, Button } from "@mui/material";

interface Movie {
  name: string;
  director: string;
  releaseDate: string;
  mpaRating: string;
}

const AddMovie: React.FC = () => {
  const [movie, setMovie] = useState<Movie>({
    name: "",
    director: "",
    releaseDate: "",
    mpaRating: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovie({ ...movie, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetchMovies(movie);
    setMovie({
      name: "",
      director: "",
      releaseDate: "",
      mpaRating: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Movie Name"
        value={movie.name}
        onChange={handleChange}
      />
      <TextField
        name="director"
        label="Director"
        value={movie.director}
        onChange={handleChange}
      />
      <TextField
        type="date"
        name="releaseDate"
        label="Release Date"
        value={movie.releaseDate}
        onChange={handleChange}
      />
      <Select
        name="mpaRating"
        label="MPA Rating"
        value={movie.mpaRating}
        onChange={handleChange}
      >
        <MenuItem value="PG">PG</MenuItem>
        <MenuItem value="PG-13">PG-13</MenuItem>
        <MenuItem value="R">R</MenuItem>
      </Select>
      <Button type="submit" variant="contained" color="primary">
        Add Movie
      </Button>
    </form>
  );
};

export default AddMovie;
