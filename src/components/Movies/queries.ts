import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query getAllMovies {
    getAllMovies {
      title
      year
      rated
      id
    }
  }
`;

export const GET_MOVIE = gql`
  query getMovie($id: ID!) {
    getMovie(id: $id) {
      title
      year
      rated
      id
    }
  }
`;
