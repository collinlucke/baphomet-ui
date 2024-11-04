import { ErrorModal } from '../shared/ErrorModal';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { CustomErrorTypes } from '../../CustomTypes.types';

type BaphErrorBoundaryTypes = {
  children?: ReactNode;
};

export const BaphErrorBoundary: FC<BaphErrorBoundaryTypes> = ({ children }) => {
  const error = useRouteError() as CustomErrorTypes;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return <ErrorModal error={error}>{children}</ErrorModal>;
  }

  return <>{children}</>;
};
