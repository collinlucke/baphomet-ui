import { ComponentType } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

type ProtectedRoute = {
  element: ComponentType<any>;
  props?: Record<string, any>;
};
export const ProtectedRoute: React.FC<ProtectedRoute> = ({
  element: Component,
  props
}) => {
  const token = localStorage.getItem('baphomet-token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component {...props} />;
};
