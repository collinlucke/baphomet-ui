import { UIEvent, useEffect, useState } from 'react';
import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Footer } from './components/Footer';
import { Main, Globals, Modal, Button } from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  errorVar,
  showHeadingVar,
  cursorVar,
  searchTermVar,
  endOfResultsVar,
  getMoviesByTitleQueryVar,
  isAuthenticatedVar,
  showUnauthorizedModalVar
} from './reactiveVars';
import { useReactiveVar, useLazyQuery } from '@apollo/client';
import { CSSObject } from '@emotion/react';
import { CHECK_AUTH } from './api/queries';
import { SignupForm } from './components/SignupForm';
import { LoginForm } from './components/LoginForm';

export const App = () => {
  const showHeading = useReactiveVar(showHeadingVar);
  const error = useReactiveVar(errorVar);
  const cursor = useReactiveVar(cursorVar);
  const searchTerm = useReactiveVar(searchTermVar);
  const endOfResults = useReactiveVar(endOfResultsVar);
  const showUnauthorizedModal = useReactiveVar(showUnauthorizedModalVar);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [checkAuth] = useLazyQuery(CHECK_AUTH, {
    onCompleted: data => {
      if (data.checkAuth.isValid) {
        isAuthenticatedVar(true);
      } else {
        // Token is invalid, clear localStorage
        localStorage.removeItem('baphomet-token');
        localStorage.removeItem('baphomet-user');
        isAuthenticatedVar(false);
      }
    },
    onError: () => {
      // Error checking token, assume invalid
      localStorage.removeItem('baphomet-token');
      localStorage.removeItem('baphomet-user');
      isAuthenticatedVar(false);
    }
  });

  // Check authentication state on app initialization
  useEffect(() => {
    const token = localStorage.getItem('baphomet-token');
    if (token) {
      // Token exists, verify it with the server
      checkAuth({ variables: { token } });
    } else {
      // No token, user is not authenticated
      isAuthenticatedVar(false);
    }
  }, [checkAuth]);

  const backgroundImage = '/back-to-the-future-backdrop.jpg';

  // Modal handlers
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleSignupModalClose = () => {
    setShowSignupModal(false);
  };

  const handleUnauthorizedModalClose = () => {
    showUnauthorizedModalVar(false);
  };

  const handleUnauthorizedModalLogin = () => {
    showUnauthorizedModalVar(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
  };

  return (
    // <ThemeProvider theme={baphTheme}>
    <>
      <Globals />

      {showHeading && (
        <Heading
          setShowLoginModal={setShowLoginModal}
          setShowSignupModal={setShowSignupModal}
        />
      )}
      <Main
        isDark={true}
        className={{ main: baphStyles(backgroundImage).main }}
      >
        <Outlet />
      </Main>
      <Footer />
      {error && <ErrorBoundary />}

      {/* Authentication Modals */}
      <Modal isOpen={showLoginModal} onClose={handleLoginModalClose}>
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>

      <Modal isOpen={showSignupModal} onClose={handleSignupModalClose}>
        <SignupForm onSuccess={handleSignupSuccess} />
      </Modal>

      {/* Unauthorized Action Modal */}
      <Modal
        isOpen={showUnauthorizedModal}
        onClose={handleUnauthorizedModalClose}
      >
        <div
          css={{
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <h3
            css={{
              color: '#f39c12',
              marginBottom: '16px',
              fontSize: '1.2em'
            }}
          >
            Action Required
          </h3>
          <p
            css={{
              color: '#e74c3c',
              marginBottom: '24px',
              fontSize: '1em'
            }}
          >
            Could not complete your action because you are not logged in.
          </p>
          <div
            css={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}
          >
            <Button onClick={handleUnauthorizedModalLogin} kind="primary">
              Log In
            </Button>
            <Button onClick={handleUnauthorizedModalClose} kind="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
    // </ThemeProvider>
  );
};

const baphStyles = (backgroundImage?: string) =>
  ({
    main: {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'grayscale(100%)',
        opacity: 0.03,
        zIndex: 1
      }
    }
  } as { [key: string]: CSSObject });

export default App;
