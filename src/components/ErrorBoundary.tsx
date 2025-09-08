import React, { ReactNode } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { ButtonGroup, Modal, Button } from '@collinlucke/phantomartist';
import { CustomErrorTypes } from '../types/CustomTypes.types';
import { errorVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

type ErrorBoundaryTypes = {
  id?: string;
  children?: ReactNode;
  error?: CustomErrorTypes;
  closeModal?: () => void;
};

export const ErrorBoundary: React.FC<ErrorBoundaryTypes> = ({ children }) => {
  const errorContent = {
    status: 'It dun broke',
    message: `This isn't looking very good for you.`
  };
  const routerError = useRouteError() as CustomErrorTypes;
  const contextError = useReactiveVar(errorVar) as CustomErrorTypes | undefined;
  const navigate = useNavigate();

  const handleErrors = () => {
    if (contextError?.networkError?.statusCode === 401) {
      errorContent.status = '401';
      errorContent.message = `Ha! No... Maybe login and try again.`;
    } else if (contextError?.networkError?.statusCode === 403) {
      errorContent.status = '403';
      errorContent.message = `Dude, don't try to come in here, I'll put my hand on your chest. Try logging in and then give it another go.`;
    } else if (routerError && routerError?.status === 404) {
      errorContent.status = '404';
      errorContent.message = `Uh-oh.... Whatever you're looking for, you ain't gonna find it here.`;
    } else if (contextError && contextError?.networkError?.statusCode === 500) {
      errorContent.status = '500';
      errorContent.message = `Look like someone out there doesn't want you to do this. Try logging in again.`;
    } else if (routerError?.name?.includes('ReferenceError')) {
      errorContent.status = 'Whomp Whomp!';
      errorContent.message =
        'Looks like one of the devs pooped the bed. Try your action again or write a nasty letter to company.';
    } else if (routerError?.name === 'TypeError') {
      errorContent.status = 'TypeError';
      errorContent.message = `Something very wrong happened. You can try refreshing the page but it probably won't fix anything.`;
    }
  };

  handleErrors();

  const goHomeHandler = () => {
    errorVar(undefined);
    navigate('/');
  };

  const goToLoginHandler = () => {
    errorVar(undefined);
    navigate('/login');
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        errorVar(undefined);
      }}
      // dataTestId={`error-modal-${errorContent.status}`}
    >
      {children ? (
        <>{children as ReactNode}</>
      ) : (
        <>
          <div>
            <h2>Error</h2>
            <p>
              <strong>Status:</strong> {errorContent?.status}
            </p>
            <p>
              <strong>Message:</strong> {errorContent?.message}
            </p>
          </div>

          <ButtonGroup>
            <Button onClick={goHomeHandler} kind="ghost">
              Go home
            </Button>
            <Button onClick={goToLoginHandler}>Log in</Button>
          </ButtonGroup>
        </>
      )}
    </Modal>
  );
};
