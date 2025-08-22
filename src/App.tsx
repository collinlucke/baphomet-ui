import { useEffect, useState } from 'react';
import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Footer } from './components/Footer';
import { Main, Globals, Modal, Button } from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  errorVar,
  showHeadingVar,
  isAuthenticatedVar,
  showUnauthorizedModalVar,
  showFeedbackModalVar,
  isMobileVar,
  isLandscapeVar,
  isMobileAndLandscapeVar
} from './reactiveVars';
import { useReactiveVar, useLazyQuery, useQuery } from '@apollo/client';
import { CSSObject } from '@emotion/react';
import { CHECK_AUTH, GET_RANDOM_BACKDROP_IMAGE } from './api/queries';
import { SignupForm } from './components/SignupForm';
import { LoginForm } from './components/LoginForm';
import { FeedbackForm } from './components/FeedbackForm';

export const App = () => {
  const showHeading = useReactiveVar(showHeadingVar);
  const error = useReactiveVar(errorVar);
  const showUnauthorizedModal = useReactiveVar(showUnauthorizedModalVar);
  const showFeedbackModal = useReactiveVar(showFeedbackModalVar);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [backdrop, setBackdrop] = useState<string>('');

  useQuery(GET_RANDOM_BACKDROP_IMAGE, {
    onCompleted: data => {
      const { backdropUrl } = data.getRandomBackdropImage;
      if (backdropUrl) {
        setBackdrop(backdropUrl);
      } else {
        console.warn('No backdrop image found');
      }
    },
    onError: error => {
      console.error('Error fetching random backdrop image:', error);
    }
  });
  const updateDeviceState = () => {
    const isMobile =
      window.innerWidth <= 768 || navigator.userAgent.includes('Mobile');
    const isLandscape = window.innerHeight < window.innerWidth;
    const isMobileAndLandscape = isMobile && isLandscape;

    isMobileVar(isMobile);
    isLandscapeVar(isLandscape);
    isMobileAndLandscapeVar(isMobileAndLandscape);
  };

  useEffect(() => {
    updateDeviceState();

    const handleResize = () => updateDeviceState();
    const handleOrientationChange = () => {
      setTimeout(updateDeviceState, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const [checkAuth] = useLazyQuery(CHECK_AUTH, {
    onCompleted: data => {
      if (data.checkAuth.isValid) {
        isAuthenticatedVar(true);
      } else {
        localStorage.removeItem('baphomet-token');
        localStorage.removeItem('baphomet-user');
        isAuthenticatedVar(false);
      }
    },
    onError: () => {
      localStorage.removeItem('baphomet-token');
      localStorage.removeItem('baphomet-user');
      isAuthenticatedVar(false);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('baphomet-token');
    if (token) {
      checkAuth({ variables: { token } });
    } else {
      isAuthenticatedVar(false);
    }
  }, [checkAuth]);

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

  const handleFeedbackModalClose = () => {
    showFeedbackModalVar(false);
  };

  const handleFeedbackSuccess = () => {
    showFeedbackModalVar(false);
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
      <Main isDark={true} className={{ main: getMainStyles(backdrop) }}>
        <Outlet />
      </Main>
      <Footer />
      {error && <ErrorBoundary />}

      <Modal isOpen={showLoginModal} onClose={handleLoginModalClose}>
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>

      <Modal isOpen={showSignupModal} onClose={handleSignupModalClose}>
        <SignupForm onSuccess={handleSignupSuccess} />
      </Modal>

      <Modal isOpen={showFeedbackModal} onClose={handleFeedbackModalClose}>
        <FeedbackForm onSuccess={handleFeedbackSuccess} />
      </Modal>

      <Modal
        isOpen={showUnauthorizedModal}
        onClose={handleUnauthorizedModalClose}
      >
        <div css={baphStyles.unauthorizedModalContent}>
          <h3 css={baphStyles.actionRequiredHeading}>Action Required</h3>
          <p css={baphStyles.unauthorizedMessage}>
            Could not complete your action because you are not logged in.
          </p>
          <div css={baphStyles.unauthorizedModalActions}>
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

const getMainStyles = (backdrop?: string) => ({
  ...baphStyles.main,
  '&::before': {
    ...(typeof baphStyles.main['&::before'] === 'object'
      ? baphStyles.main['&::before']
      : {}),
    backgroundImage: `url(${backdrop})`
  }
});

const baphStyles: { [key: string]: CSSObject } = {
  main: {
    position: 'relative',
    zIndex: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      filter: 'grayscale(100%)',
      opacity: 0.05,
      zIndex: -1
    }
  },
  unauthorizedModalContent: {
    textAlign: 'center',
    padding: '20px'
  },
  actionRequiredHeading: {
    color: '#f39c12',
    marginBottom: '16px',
    fontSize: '1.2rem'
  },
  unauthorizedMessage: {
    color: '#e74c3c',
    marginBottom: '24px',
    fontSize: '1rem'
  },
  unauthorizedModalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  }
};

export default App;
