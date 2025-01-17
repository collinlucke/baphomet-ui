import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query getAllMovies(
    $limit: Int
    $searchTerm: String
    $cursor: String
    $loadAction: String
  ) {
    movieResults: getAllMovies(
      limit: $limit
      searchTerm: $searchTerm
      cursor: $cursor
      loadAction: $loadAction
    ) {
      newMovies {
        fullplot
        poster
        title
        releaseDate
        rated
        id
      }
      newTotalMovieCount
      newCursor
      loadAction
      endOfResults
    }
  }
`;

export const GET_MOVIE = gql`
  query getMovie($id: ID!) {
    movie: getMovie(id: $id) {
      poster
      title
      releaseDate
      rated
      id
      fullplot
    }
  }
`;

export const CHECK_AUTH = gql`
  query checkAuth($token: String) {
    checkAuth(token: $token) {
      isValid
    }
  }
`;
