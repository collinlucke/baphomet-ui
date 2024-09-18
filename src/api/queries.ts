import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query getAllMovies($limit: Int) {
    allMovies: getAllMovies(limit: $limit) {
      poster
      title
      year
      rated
      id
    }
  }
`;

export const GET_MOVIE = gql`
  query getMovie($id: ID!) {
    movie: getMovie(id: $id) {
      poster
      title
      year
      rated
      id
      fullplot
    }
  }
`;
