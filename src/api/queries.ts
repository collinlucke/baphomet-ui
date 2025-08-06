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
      searchResults {
        id
        title
        rated
        releaseDate
        overview
        genres
        revenue
        posterUrl
        backdropUrl
        tmdbId
        addedBy
        lastUpdated
        createdAt
        totalWins
        totalLosses
        winningPercentage
        totalComparisons
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
      posterUrl
      overview
      genres
      title
      releaseDate
      rated
      id
      overview
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

export const CHECK_MOVIE_BY_TMDB_ID = gql`
  query checkMovieByTmdbId($tmdbId: String!) {
    movieResults: getAllMovies(searchTerm: $tmdbId) {
      searchResults {
        id
        title
        tmdbId
      }
    }
  }
`;
