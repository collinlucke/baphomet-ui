import {
  ServerError,
  ServerParseError,
  CombinedGraphQLErrors
} from '@apollo/client/errors';
import { GraphQLFormattedError, GraphQLErrorExtensions } from 'graphql';

export type CustomNetworkErrorTypes =
  | ServerError
  | (ServerParseError & { statusCode?: number });

export type CustomApolloErrorTypes = CombinedGraphQLErrors & {
  networkError?: CustomNetworkErrorTypes;
  status?: string | number;
  statusCode?: number;
  cause?: Error;
};

export type CustomErrorTypes = Error & {
  title: string;
  name: string;
  message: string;
  status?: string | number;
  networkError?: CustomNetworkErrorTypes;
  apolloError?: CustomApolloErrorTypes;
  graphQLErrors: ReadonlyArray<GraphQLFormattedError>;
  protocolErrors: ReadonlyArray<{
    message: string;
    extensions?: GraphQLErrorExtensions[];
  }>;
  clientErrors: ReadonlyArray<Error>;
  statusCode?: number;
  extraInfo?: unknown;
  cause?: Error;
  stack?: string;
};

export type GetMoviesByTitleQueryVarsObject = {
  variables: {
    limit: number;
    searchTerm: string | number | undefined;
    cursor: string;
    endOfResults: boolean;
  };
};

export type User = {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  totalVotes: number;
  joinDate: string;
  role: string;
  emailVerified: boolean;
};

export type LeaderboardType = {
  leaderboard: {
    users: User[];
    newCursor: string;
    endOfResults: boolean;
  };
};
