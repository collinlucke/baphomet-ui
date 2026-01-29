import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Layouts/Header';
import { Footer } from './components/Layouts/Footer';
// import { Main, Globals, Modal, mediaQueries, screenSizes } from 'phantomartist';
import { Modal, screenSizes } from 'phantomartist';
// import { Main } from './components/Layouts/Main';
import {
  isAuthenticatedVar,
  showUnauthorizedModalVar,
  showFeedbackModalVar,
  isMobileVar,
  isLandscapeVar,
  showSignUpModalVar,
  showLoginModalVar,
  isLargeScreenVar,
  isMobileAndLandscapeVar,
  showSlideOutMenuVar,
  isSmallOrMobileVar,
  headerHeightVar
} from './reactiveVars';
import { useReactiveVar, useLazyQuery, useQuery } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { CHECK_AUTH, GET_RANDOM_BACKDROP_IMAGE } from './api/queries';
import { SignupForm } from './components/ModalContents/SignupForm';
import { LoginForm } from './components/ModalContents/LoginForm';
import { FeedbackForm } from './components/ModalContents/FeedbackForm';
import { UnauthorizedModalContent } from './components/ModalContents/UnauthorizedModalContent';
import type { AuthData } from './types/CustomTypes.types';
import { Globals } from './styling/Globals';
import './styling/index.css';

type BackdropData = {
  getRandomBackdropImage: {
    backdropPath: string;
  };
};

export const App = () => {
  const showUnauthorizedModal = useReactiveVar(showUnauthorizedModalVar);
  const showFeedbackModal = useReactiveVar(showFeedbackModalVar);
  const showLoginModal = useReactiveVar(showLoginModalVar);
  const showSignupModal = useReactiveVar(showSignUpModalVar);
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const [backdrop, setBackdrop] = useState<string>('');

  const { data: backdropData, error: backdropError } = useQuery(
    GET_RANDOM_BACKDROP_IMAGE
  );

  const [checkAuth, { data: authData, error: authError }] =
    useLazyQuery(CHECK_AUTH);

  const updateDeviceState = () => {
    const headerHeight = document.querySelector('header')?.clientHeight;

    isMobileVar(navigator.userAgent.includes('Mobile'));
    isLandscapeVar(window.innerHeight < window.innerWidth);
    isLargeScreenVar(window.innerWidth >= screenSizes.lg);
    isMobileAndLandscapeVar(isMobileVar() && isLandscapeVar());
    showSlideOutMenuVar(isMobileVar() && showSlideOutMenu);
    isSmallOrMobileVar(!isLargeScreenVar() || isMobileVar());
    headerHeightVar(headerHeight);
  };

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
      const { backdropPath } = typedData.getRandomBackdropImage;
      if (backdropPath) {
        setBackdrop(backdropPath);
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
    <div>
      <Globals />

      <Header />

      <div css={getMainStyles(backdrop)}>
        <Outlet />
      </div>

      <Footer />

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
    </div>
  );
};

export default App;

const getMainStyles = (backdrop?: string): CSSObject => ({
  position: 'relative' as const,
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed' as const,
    filter: 'grayscale(100%)',
    opacity: 0.05,
    zIndex: -1,
    backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop})`
  }
});
