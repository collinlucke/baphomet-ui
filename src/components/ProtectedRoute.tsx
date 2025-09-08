import { ComponentType, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  CustomErrorTypes,
  CustomNetworkErrorTypes
} from '../types/CustomTypes.types';
import {
  errorVar,
  showHeadingVar,
  isAuthenticatedVar,
  showUnauthorizedModalVar
} from '../reactiveVars';
import { useQuery, useReactiveVar } from '@apollo/client/react';
import { CHECK_AUTH } from '../api/queries';
import type { AuthData } from '../types/CustomTypes.types';

type ApolloErrorExtended = {
  networkError?: CustomNetworkErrorTypes;
  cause?: CustomErrorTypes;
  protocolErrors?: Array<{
    message: string;
    extensions?: unknown;
  }>;
  clientErrors?: unknown[];
  graphQLErrors?: unknown[];
  message: string;
  name: string;
};

type ProtectedRouteTypes = {
  element: ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
};
export const ProtectedRoute: React.FC<ProtectedRouteTypes> = ({
  element: Component,
  props
}) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const error = useReactiveVar(errorVar);
  const baphToken = localStorage.getItem('baphomet-token') || null;
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  const { data, error: queryError } = useQuery(CHECK_AUTH, {
    variables: {
      token: baphToken
    },
    skip: !baphToken
  });

  // Handle auth data
  useEffect(() => {
    if (data) {
      const typedData = data as AuthData;
      setAuthCheckCompleted(true);
      if (typedData.checkAuth.isValid) {
        isAuthenticatedVar(true);
      } else {
        isAuthenticatedVar(false);
        showUnauthorizedModalVar(true);
      }
    }
  }, [data]);

  // Handle auth error
  useEffect(() => {
    if (queryError) {
      setAuthCheckCompleted(true);
      const apolloError = queryError as ApolloErrorExtended;

      const titledError: CustomErrorTypes = {
        name: apolloError.name || 'ApolloError',
        message: apolloError.message || 'Authentication check failed',
        title: 'checkAuth',
        networkError: apolloError.networkError,
        cause: apolloError.cause,
        protocolErrors: [],
        clientErrors: [],
        graphQLErrors: []
      };
      errorVar(titledError);

      isAuthenticatedVar(false);
      showUnauthorizedModalVar(true);
    }
  }, [queryError]);

  useEffect(() => {
    if (!baphToken) {
      setAuthCheckCompleted(true);
      isAuthenticatedVar(false);
      showUnauthorizedModalVar(true);
    }
  }, [baphToken]);

  useEffect(() => {
    if (error) {
      showHeadingVar(false);
    }
  }, [error]);

  return (
    <>
      {!authCheckCompleted ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Checking authentication...
        </div>
      ) : !isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <Component {...(props || {})} />
      )}
    </>
  );
};
