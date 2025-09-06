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
  query getMoviesByTitle(
    $title: String
    $limit: Int
    $cursor: String
    $sortBy: String
    $sortOrder: String
  ) {
    movieResults: getMoviesByTitle(
      title: $title
      limit: $limit
      cursor: $cursor
      sortBy: $sortBy
      sortOrder: $sortOrder
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

export const GET_RANDOM_MATCHUP = gql`
  query getRandomMovieMatchup {
    getRandomMovieMatchup {
      movie1 {
        id
        title
        posterUrl
        backdropUrl
        releaseDate
        genres
        winningPercentage
        totalWins
        totalLosses
        totalComparisons
      }
      movie2 {
        id
        title
        posterUrl
        backdropUrl
        releaseDate
        genres
        winningPercentage
        totalWins
        totalLosses
        totalComparisons
      }
      comparisonId
    }
  }
`;

export const GET_RANDOM_BACKDROP_IMAGE = gql`
  query getRandomBackdropImage {
    getRandomBackdropImage {
      backdropUrl
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query getUserInfo($userId: String!) {
    user: getUserDetails(userId: $userId) {
      id
      username
      email
      displayName
      totalVotes
      joinDate
      role
      emailVerified
    }
  }
`;

export const GET_USER_LEADERBOARD = gql`
  query getUserLeaderboard($cursor: String) {
    leaderboard: getUserLeaderboard(cursor: $cursor) {
      users {
        id
        username
        email
        displayName
        totalVotes
        joinDate
        role
        emailVerified
      }
      newTotalUserCount
      newCursor
      endOfResults
    }
  }
`;
