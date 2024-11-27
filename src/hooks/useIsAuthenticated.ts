import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useError } from '../contexts';
import {
  CustomErrorTypes,
  CustomNetworkErrorTypes
} from '../CustomTypes.types';
import { CHECK_AUTH } from '../api/queries';

type UseIsAuthenticatedTypes = {
  protectedRoute?: boolean;
};

export const useIsAuthenticated: React.FC<UseIsAuthenticatedTypes> = ({
  protectedRoute = false
} = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setError } = useError();
  const baphToken = localStorage.getItem('baphomet-token');

  useQuery(CHECK_AUTH, {
    variables: {
      token: baphToken
    },
    onCompleted: data => {
      setIsAuthenticated(data.checkAuth.isValid);
    },
    onError: error => {
      if (protectedRoute) {
        const titledError = {
          ...error,
          title: 'checkAuth',
          networkError: error.networkError as
            | CustomNetworkErrorTypes
            | undefined,
          cause: error.cause as CustomErrorTypes
        };
        setError(titledError);
      }

      setIsAuthenticated(false);
    }
  });

  return isAuthenticated;
};
