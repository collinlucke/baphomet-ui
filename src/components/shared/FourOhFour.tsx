import { ErrorModal } from '../shared/ErrorModal';
import { useEffect } from 'react';
import { useShowHeading } from '../../contexts';

export const FourOhFour = () => {
  const {
    // showHeading,
    setShowHeading
  } = useShowHeading();
  const FourOhFourError = {
    status: '404',
    message: `Uh-oh.... Whatever you're looking for, you ain't gonna find it here.`
  };

  useEffect(() => {
    setShowHeading(true);
    console.error('Fake 404');
  }, [setShowHeading]);

  return (
    <ErrorModal
      id="baph-movie-list-error"
      error={FourOhFourError}
      // closeModal={dismissErrorHandler}
    />
  );
};
