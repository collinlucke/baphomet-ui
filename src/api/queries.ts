import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query getAllMovies(
    $title: String
    $sortBy: String
    $sortOrder: String
    $limit: Int
    $cursor: String
  ) {
    movieResults: getMovies(
      title: $title
      limit: $limit
      cursor: $cursor
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      searchResults {
        id
        title
        releaseDate
        overview
        genres
        revenue
        posterPath
        backdropPath
        tmdbId
        tagline
        topBilledCast {
          id
          name
          role
          profilePath
        }
        directors {
          id
          name
          profilePath
          role
        }
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

export const GET_MOVIE_LIST_ITEMS = gql`
  query getMovieListItems($limit: Int, $title: String, $cursor: String) {
    movieResults: getMovies(limit: $limit, title: $title, cursor: $cursor) {
      searchResults {
        id
        title
        posterPath
        winningPercentage
      }
      newTotalMovieCount
      newCursor
      endOfResults
    }
  }
`;

export const GET_MOVIE_DETAILS = gql`
  query getMovieDetails($id: ID!) {
    movieResults: getMovieDetails(id: $id) {
      id
      title
      releaseDate
      overview
      genres
      revenue
      posterPath
      backdropPath
      tmdbId
      tagline
      topBilledCast {
        id
        name
        role
        profilePath
      }
      directors {
        id
        name
        profilePath
        role
      }
      addedBy
      lastUpdated
      createdAt
      totalWins
      totalLosses
      winningPercentage
      totalComparisons
      posterImages {
        w92
        w154
        w185
        w342
        w500
        w780
        original
      }
      backdropImages {
        w92
        w154
        w185
        w342
        w500
        w780
        original
      }
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
        releaseDate
        overview
        genres
        revenue
        posterPath
        backdropPath
        tmdbId
        tagline
        topBilledCast {
          id
          name
          role
          profilePath
        }
        directors {
          id
          name
          role
          profilePath
        }
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
    movieResult: getMovieByTmdbId(tmdbId: $tmdbId) {
      found
      errorMessage
      movie {
        id
        title
        releaseDate
        overview
        genres
        revenue
        posterPath
        backdropPath
        tmdbId
        tagline
        topBilledCast {
          id
          name
          role
          profilePath
        }
        directors {
          id
          name
          profilePath
          role
        }
      }
    }
  }
`;

export const FETCH_MOVIE_FROM_TMDB = gql`
  query fetchMovieFromTmdb($tmdbId: String!) {
    fetchedMovie: fetchMovieFromTmdb(tmdbId: $tmdbId) {
      title
      releaseDate
      overview
      genres
      revenue
      posterPath
      backdropPath
      tmdbId
      tagline
      topBilledCast {
        id
        name
        role
        profilePath
      }
      directors {
        id
        name
        profilePath
        role
      }
    }
  }
`;

export const FETCH_POSSIBLE_MOVIE_MATCHES = gql`
  query fetchPossibleMovieMatches($title: String!) {
    possibleMovieMatches: fetchPossibleMovieMatches(title: $title) {
      page
      results {
        id
        title
        releaseDate
        overview
        genreIds
        posterPath
        backdropPath
      }
      totalResults
      totalPages
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
    movieResults: findMovie(tmdbId: $tmdbId) {
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
        posterPath
        backdropPath
        releaseDate
        genres
        winningPercentage
        totalWins
        totalLosses
        totalComparisons
        posterImages {
          w92
          w154
          w185
          w342
          w500
          w780
          original
        }
        backdropImages {
          w92
          w154
          w185
          w342
          w500
          w780
          original
        }
      }
      movie2 {
        id
        title
        posterPath
        backdropPath
        releaseDate
        genres
        winningPercentage
        totalWins
        totalLosses
        totalComparisons
        posterImages {
          w92
          w154
          w185
          w342
          w500
          w780
          original
        }
        backdropImages {
          w92
          w154
          w185
          w342
          w500
          w780
          original
        }
      }
      comparisonId
    }
  }
`;

export const GET_RANDOM_BACKDROP_IMAGE = gql`
  query getRandomBackdropImage {
    getRandomBackdropImage {
      backdropPath
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
