import { ComponentType } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

type ProtectedRoute = {
  element: ComponentType<any>;
  props?: any;
};
export const ProtectedRoute: React.FC<ProtectedRoute> = ({
  element: Component,
  props
}) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component {...props} />;
};
