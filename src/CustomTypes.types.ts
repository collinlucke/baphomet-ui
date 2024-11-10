import { ServerError, ServerParseError } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';

export type CustomNetworkErrorTypes =
  | ServerError
  | (ServerParseError & { statusCode?: number });

export type CustomApolloErrorTypes = ApolloError & {
  networkError?: CustomNetworkErrorTypes;
  status?: string | number;
  statusCode?: number;
  cause?: Error;
};

export type CustomErrorTypes = Error & {
  message?: string;
  status?: string | number;
  networkError?: CustomNetworkErrorTypes;
  ApolloError?: ApolloError;
  statusCode?: number;
  cause?: Error;
};
