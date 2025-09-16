import { useEffect, useState } from 'react';
import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Footer } from './components/Footer';
import { MainNav } from './components/Navs/MainNav';
import {
  Main,
  Globals,
  Modal,
  mediaQueries,
  SlideOutMenu
} from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  errorVar,
  showHeadingVar,
  isAuthenticatedVar,
  showUnauthorizedModalVar,
  showFeedbackModalVar,
  isMobileVar,
  isLandscapeVar,
  isMobileAndLandscapeVar,
  showSignUpModalVar,
  showLoginModalVar
} from './reactiveVars';
import { useReactiveVar, useLazyQuery, useQuery } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { CHECK_AUTH, GET_RANDOM_BACKDROP_IMAGE } from './api/queries';
import { SignupForm } from './components/SignupForm';
import { LoginForm } from './components/LoginForm';
import { FeedbackForm } from './components/FeedbackForm';
import { UnauthorizedModalContent } from './components/UnauthorizedModalContent';
import type { AuthData } from './types/CustomTypes.types';

type BackdropData = {
  getRandomBackdropImage: {
    backdropUrl: string;
  };
};

export const App = () => {
  const showHeading = useReactiveVar(showHeadingVar);
  const error = useReactiveVar(errorVar);
  const isMobile = useReactiveVar(isMobileVar);
  const showUnauthorizedModal = useReactiveVar(showUnauthorizedModalVar);
  const showFeedbackModal = useReactiveVar(showFeedbackModalVar);
  const showLoginModal = useReactiveVar(showLoginModalVar);
  const showSignupModal = useReactiveVar(showSignUpModalVar);
  const [backdrop, setBackdrop] = useState<string>('');

  const { data: backdropData, error: backdropError } = useQuery(
    GET_RANDOM_BACKDROP_IMAGE
  );

  const [checkAuth, { data: authData, error: authError }] =
    useLazyQuery(CHECK_AUTH);

  const updateDeviceState = () => {
    console.log(navigator.userAgent);
    const isMobile = navigator.userAgent.includes('Mobile');
    const isLandscape = window.innerHeight < window.innerWidth;
    const isMobileAndLandscape = isMobile && isLandscape;

    isMobileVar(isMobile);
    isLandscapeVar(isLandscape);
    isMobileAndLandscapeVar(isMobileAndLandscape);
    showHeadingVar(!isMobile);
  };

  // In case anyone asks, I like to use handlers as much a possible
  const closeLoginModalHandler = () => {
    showLoginModalVar(false);
  };

  const closeSignupModalHandler = () => {
    showSignUpModalVar(false);
  };

  const closeUnauthorizedModalHandler = () => {
    showUnauthorizedModalVar(false);
  };

  const loginSuccessHandler = () => {
    showLoginModalVar(false);
  };

  const signupSuccessHandler = () => {
    showSignUpModalVar(false);
  };

  const closeFeedbackModalHandler = () => {
    showFeedbackModalVar(false);
  };

  const feedbackSuccessHandler = () => {
    showFeedbackModalVar(false);
  };

  useEffect(() => {
    if (backdropData) {
      const typedData = backdropData as BackdropData;
      const { backdropUrl } = typedData.getRandomBackdropImage;
      if (backdropUrl) {
        setBackdrop(backdropUrl);
      } else {
        console.warn('No backdrop image found');
      }
    }
  }, [backdropData]);

  useEffect(() => {
    if (backdropError) {
      console.error('Error fetching random backdrop image:', backdropError);
    }
  }, [backdropError]);

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

  useEffect(() => {
    const token = localStorage.getItem('baphomet-token');
    if (token) {
      checkAuth({ variables: { token } });
    } else {
      localStorage.removeItem('baphomet-user');
      isAuthenticatedVar(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    if (authData) {
      const typedAuthData = authData as AuthData;
      if (typedAuthData.checkAuth.isValid) {
        isAuthenticatedVar(true);
      } else {
        localStorage.removeItem('baphomet-token');
        localStorage.removeItem('baphomet-user');
        isAuthenticatedVar(false);
      }
    }
  }, [authData, authError]);

  return (
    <>
      <Globals />

      {showHeading && <Heading />}
      {isMobile && (
        <SlideOutMenu isMobile={isMobile}>
          <MainNav />
        </SlideOutMenu>
      )}
      <Main isDark={true} className={{ main: getMainStyles(backdrop) }}>
        <Outlet />
      </Main>
      <div css={baphStyles.footerWrapper}>
        <Footer />
      </div>
      {error && <ErrorBoundary />}

      <Modal isOpen={showLoginModal} onClose={closeLoginModalHandler}>
        <LoginForm onSuccess={loginSuccessHandler} />
      </Modal>

      <Modal isOpen={showSignupModal} onClose={closeSignupModalHandler}>
        <SignupForm onSuccess={signupSuccessHandler} />
      </Modal>

      <Modal isOpen={showFeedbackModal} onClose={closeFeedbackModalHandler}>
        <FeedbackForm onSuccess={feedbackSuccessHandler} />
      </Modal>

      <Modal
        isOpen={showUnauthorizedModal}
        onClose={closeUnauthorizedModalHandler}
      >
        <UnauthorizedModalContent />
      </Modal>
    </>
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
    minHeight: '100vh',
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

  footerWrapper: {
    display: 'none',
    [mediaQueries.minWidth.lg]: {
      display: 'block'
    }
  }
};

export default App;
