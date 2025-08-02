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
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHECK_AUTH } from '../api/queries';

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

  useQuery(CHECK_AUTH, {
    variables: {
      token: baphToken
    },
    skip: !baphToken, // Skip the query if there's no token
    onCompleted: data => {
      setAuthCheckCompleted(true);
      if (data.checkAuth.isValid) {
        isAuthenticatedVar(true);
      } else {
        isAuthenticatedVar(false);
        // Only show modal after auth check is complete and user is not authenticated
        showUnauthorizedModalVar(true);
      }
    },
    onError: error => {
      setAuthCheckCompleted(true);
      const titledError: CustomErrorTypes = {
        ...error,
        title: 'checkAuth',
        networkError: error.networkError as CustomNetworkErrorTypes | undefined,
        cause: error.cause as CustomErrorTypes,
        protocolErrors:
          error.protocolErrors?.map(err => ({
            message: err.message,
            extensions: err.extensions ? [err.extensions] : undefined
          })) || [],
        clientErrors: error.clientErrors || [],
        graphQLErrors: error.graphQLErrors || []
      };
      errorVar(titledError);

      isAuthenticatedVar(false);
      // Only show modal after auth check fails
      showUnauthorizedModalVar(true);
    }
  });

  // Handle case where there's no token (immediate unauthenticated state)
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
        // Show loading while checking authentication
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
