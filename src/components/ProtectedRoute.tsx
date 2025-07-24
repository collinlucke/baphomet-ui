import { ComponentType, useEffect } from 'react';
import {
  CustomErrorTypes,
  CustomNetworkErrorTypes
} from '../types/CustomTypes.types';
import { errorVar, showHeadingVar, isAuthenticatedVar } from '../reactiveVars';
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
  useQuery(CHECK_AUTH, {
    variables: {
      token: baphToken
    },
    onCompleted: data => {
      if (data.checkAuth.isValid) {
        isAuthenticatedVar(true);
      }
    },
    onError: error => {
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
    }
  });

  useEffect(() => {
    if (error) {
      showHeadingVar(false);
    }
  }, [error]);

  return <>{!isAuthenticated ? <></> : <Component {...(props || {})} />}</>;
};
