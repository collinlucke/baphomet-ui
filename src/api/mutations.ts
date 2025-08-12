import { gql } from '@apollo/client';

// TODO: Update to handle uploading movie posters

export const ADD_MOVIE = gql`
  mutation addMovie(
    $title: String!
    $releaseDate: String
    $overview: String
    $genres: [String]
    $revenue: String
    $posterUrl: String
    $backdropUrl: String
    $tmdbId: String
    $addedBy: ID
    $lastUpdated: DateTime
    $createdAt: DateTime
    $totalWins: Int
    $totalLosses: Int
    $winningPercentage: Float
    $totalComparisons: Int
  ) {
    newMovie: addMovie(
      title: $title
      releaseDate: $releaseDate
      overview: $overview
      genres: $genres
      revenue: $revenue
      posterUrl: $posterUrl
      backdropUrl: $backdropUrl
      tmdbId: $tmdbId
      addedBy: $addedBy
      lastUpdated: $lastUpdated
      createdAt: $createdAt
      totalWins: $totalWins
      totalLosses: $totalLosses
      winningPercentage: $winningPercentage
      totalComparisons: $totalComparisons
    ) {
      id
      title
      releaseDate
      overview
      genres
      revenue
      posterUrl
      backdropUrl
      tmdbId
      totalWins
      totalLosses
      winningPercentage
      totalComparisons
      addedBy
      lastUpdated
      createdAt
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation updateMovie(
    $id: ID!
    $title: String!
    $rated: String
    $releaseDate: String
    $posterUrl: String
    $overview: String
  ) {
    updatedMovie: updateMovie(
      id: $id
      title: $title
      rated: $rated
      releaseDate: $releaseDate
      posterUrl: $posterUrl
      overview: $overview
    ) {
      title
      releaseDate
      rated
      id
      posterUrl
      overview
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
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
  }
`;

export const SIGNUP = gql`
  mutation signup(
    $username: String!
    $email: String!
    $password: String!
    $displayName: String
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      displayName: $displayName
    ) {
      token
      user {
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
  }
`;

export const DELETE_MOVIE = gql`
  mutation deleteMovie($id: ID!) {
    deleteMovie(id: $id)
  }
`;

export const SUBMIT_VOTE = gql`
  mutation submitVote($movie1Id: ID!, $movie2Id: ID!, $winnerId: ID!) {
    submitVote(movie1Id: $movie1Id, movie2Id: $movie2Id, winnerId: $winnerId) {
      success
      message
      comparison {
        id
        movie1Id
        movie2Id
        movie1Wins
        movie2Wins
        totalVotes
        updatedAt
      }
    }
  }
`;
