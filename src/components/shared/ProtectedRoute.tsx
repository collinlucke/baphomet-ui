import { ComponentType, useEffect } from 'react';
import { useError } from '../../contexts';
import { useShowHeading } from '../../contexts';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

type ProtectedRouteTypes = {
  element: ComponentType<any>;
  props?: Record<string, any>;
};
export const ProtectedRoute: React.FC<ProtectedRouteTypes> = ({
  element: Component,
  props
}) => {
  const isAuthenticated = useIsAuthenticated({ protectedRoute: true });
  const { error } = useError();
  const { setShowHeading } = useShowHeading();

  useEffect(() => {
    if (error) {
      setShowHeading(false);
    }
  }, [error]);

  return <>{!isAuthenticated ? <div /> : <Component {...props} />}</>;
};
