import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query getAllMovies(
    $limit: Int
    $searchTerm: String
    $tmdbId: String
    $cursor: String
  ) {
    movieResults: getAllMovies(
      limit: $limit
      searchTerm: $searchTerm
      tmdbId: $tmdbId
      cursor: $cursor
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
      endOfResults
    }
  }
`;

export const GET_MOVIES_BY_TITLE = gql`
  query getMoviesByTitle($title: String, $limit: Int, $cursor: String) {
    movieResults: getMoviesByTitle(
      title: $title
      limit: $limit
      cursor: $cursor
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
      endOfResults
    }
  }
`;

export const GET_MOVIE_BY_TMDB_ID = gql`
  query getMovieByTmdbId($tmdbId: String!) {
    movieResults: getMovieByTmdbId(tmdbId: $tmdbId) {
      searchResults {
        id
        title
        posterUrl
        winningPercentage
      }
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
    movieResults: getAllMovies(tmdbId: $tmdbId) {
      searchResults {
        id
        title
        tmdbId
      }
    }
  }
`;
