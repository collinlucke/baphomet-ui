import { gql } from '@apollo/client';

export const ADD_MOVIE = gql`
  mutation addMovie($title: String!, $rated: String, $year: Int) {
    addMovie(title: $title, rated: $rated, year: $year) {
      title
      year
      rated
      id
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation updateMovie($id: ID!, $title: String!, $rated: String, $year: Int) {
    updateMovie(id: $id, title: $title, rated: $rated, year: $year) {
      title
      year
      rated
      id
    }
  }
`;
