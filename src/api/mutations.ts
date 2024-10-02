import { gql } from '@apollo/client';

// TODO: Update to handle uploading movie posters

export const ADD_MOVIE = gql`
  mutation addMovie(
    $title: String!
    $rated: String
    $year: Int
    $fullplot: String
  ) {
    newMovie: addMovie(
      title: $title
      rated: $rated
      year: $year
      fullplot: $fullplot
    ) {
      title
      year
      rated
      id
      fullplot
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation updateMovie(
    $id: ID!
    $title: String!
    $rated: String
    $year: Int
    $poster: String
    $fullplot: String
  ) {
    updatedMovie: updateMovie(
      id: $id
      title: $title
      rated: $rated
      year: $year
      poster: $poster
      fullplot: $fullplot
    ) {
      title
      year
      rated
      id
      poster
      fullplot
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
