import { gql } from '@apollo/client';

export const ADD_MOVIE = gql`
  mutation addMovie(
    $title: String!
    $releaseDate: String
    $overview: String
    $genres: [String]
    $revenue: String
    $posterPath: String
    $backdropPath: String
    $tmdbId: String
    $tagline: String
    $topBilledCast: [CastMemberInput]
    $directors: [DirectorInput]
    $addedBy: ID
    $lastUpdated: DateTime
    $createdAt: DateTime
    $totalWins: Int
    $totalLosses: Int
    $winningPercentage: Float
    $totalComparisons: Int
  ) {
    addMovie(
      title: $title
      releaseDate: $releaseDate
      overview: $overview
      genres: $genres
      revenue: $revenue
      posterPath: $posterPath
      backdropPath: $backdropPath
      tmdbId: $tmdbId
      tagline: $tagline
      topBilledCast: $topBilledCast
      directors: $directors
      addedBy: $addedBy
      lastUpdated: $lastUpdated
      createdAt: $createdAt
      totalWins: $totalWins
      totalLosses: $totalLosses
      winningPercentage: $winningPercentage
      totalComparisons: $totalComparisons
    ) {
      success
      message
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
          character
          profilePath
        }
        directors {
          id
          name
          profilePath
        }
        totalWins
        totalLosses
        winningPercentage
        totalComparisons
      }
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation updateMovie(
    $id: ID!
    $title: String
    $releaseDate: String
    $posterPath: String
    $backdropPath: String
    $tmdbId: String
    $overview: String
    $genres: [String]
    $revenue: String
    $tagline: String
    $topBilledCast: [CastMemberInput]
    $directors: [DirectorInput]
  ) {
    updateMovie(
      id: $id
      title: $title
      releaseDate: $releaseDate
      posterPath: $posterPath
      backdropPath: $backdropPath
      tmdbId: $tmdbId
      overview: $overview
      genres: $genres
      revenue: $revenue
      tagline: $tagline
      topBilledCast: $topBilledCast
      directors: $directors
    ) {
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
        profilePath
        role
      }
      directors {
        id
        name
        profilePath
        role
      }
      totalWins
      totalLosses
      winningPercentage
      totalComparisons
    }
  }
`;

export const LOGIN = gql`
  mutation login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
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
        firstName
        lastName
        birthday
        avatarUrl
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
    $firstName: String
    $lastName: String
    $birthday: String
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      displayName: $displayName
      firstName: $firstName
      lastName: $lastName
      birthday: $birthday
    ) {
      token
      user {
        id
        username
        email
        displayName
        firstName
        lastName
        birthday
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

export const SUBMIT_FEEDBACK = gql`
  mutation submitFeedback(
    $email: String
    $comments: String!
    $timestamp: DateTime!
  ) {
    submitFeedback(email: $email, comments: $comments, timestamp: $timestamp) {
      success
      message
      feedback {
        id
        email
        comments
        timestamp
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: ID!
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $displayName: String
    $birthday: String
    $avatarUrl: String
  ) {
    updateProfile(
      id: $id
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      displayName: $displayName
      birthday: $birthday
      avatarUrl: $avatarUrl
    ) {
      id
      firstName
      lastName
      username
      email
      displayName
      birthday
      totalVotes
      joinDate
      role
      emailVerified
      avatarUrl
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $id: ID!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      id: $id
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
      email
      displayName
      birthday
      avatarUrl
    }
  }
`;
