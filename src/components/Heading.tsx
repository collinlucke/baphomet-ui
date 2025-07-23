import {
  Header,
  Button,
  ButtonGroup,
  InnerWidth,
  Block,
  Modal
} from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useScreenSize } from '../hooks/useScreenSize';
import { PlusSignIcon } from 'hugeicons-react';
import { isAuthenticatedVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client';
import { baphColors, baphTypography } from '../styling/baphTheme';
import { SignupForm, SignupFormData, AuthResponse } from './SignupForm';
import { LoginForm, LoginFormData } from './LoginForm';
import { useState } from 'react';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navToCreate = () => {
    navigate('/create');
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const navToArena = () => {
    navigate('/arena');
  };

  const navToLeaderboards = () => {
    navigate('/leaderboards');
  };

  const navToMovies = () => {
    navigate('/movies');
  };

  const logOut = () => {
    localStorage.removeItem('baphomet-token');
    isAuthenticatedVar(false);
  };

  const handleSignupSuccess = (authResponse: AuthResponse) => {
    // Successfully created account for user: authResponse.user.username
    isAuthenticatedVar(true);
    setShowSignupModal(false);
    // You could also redirect or show a success message here
  };

  const handleSignupError = (error: string) => {
    // Handle signup error - could show an error toast or message here
    console.error('Signup failed:', error);
  };

  const handleLoginSuccess = (authResponse: AuthResponse) => {
    // Successfully logged in user: authResponse.user.username
    isAuthenticatedVar(true);
    setShowLoginModal(false);
    // You could also redirect or show a success message here
  };

  const handleLoginError = (error: string) => {
    // Handle login error - could show an error toast or message here
    console.error('Login failed:', error);
  };

  return (
    <>
      <Header
        dataTestId="main-page-heading"
        className={{ header: baphStyles.header }}
      >
        <Block>
          <InnerWidth
            size="large"
            className={{ innerWidth: baphStyles.innerWidth }}
          >
            <div css={baphStyles.headerContent}>
              <h1 css={baphStyles.logo}>
                <Link
                  to={'/'}
                  data-testid="home-link"
                  css={baphStyles.logoLink}
                >
                  Baphomet
                  <img
                    src="/baphy-favicon.png"
                    alt="Baphomet favicon"
                    css={baphStyles.favicon}
                  />
                </Link>
              </h1>

              <div css={baphStyles.actions}>
                {/* Navigation button group */}
                <ButtonGroup
                // className={{ buttonGroup: baphStyles.navButtonGroup }}
                // gap="medium"
                >
                  <Button kind="ghost" onClick={navToArena} size="medium">
                    Arena
                  </Button>
                  <Button
                    kind="ghost"
                    onClick={navToLeaderboards}
                    size="medium"
                  >
                    Leader Boards
                  </Button>
                  <Button kind="ghost" onClick={navToMovies} size="medium">
                    All Movies
                  </Button>
                </ButtonGroup>

                {/* Add movie button - only when authenticated */}
                {isAuthenticated && (
                  <Button
                    dataTestId="add-new-movie-button"
                    size="medium"
                    onClick={navToCreate}
                    icon={<PlusSignIcon size={17} strokeWidth={'3px'} />}
                    iconOnly={screenSize === 'small'}
                    className={{ button: baphStyles.addButton }}
                    kind="secondary"
                  >
                    {screenSize === 'small' ? '' : 'Add new movie'}
                  </Button>
                )}

                {/* Signup/Login buttons - only when not authenticated */}
                {!isAuthenticated ? (
                  <div css={baphStyles.authButtons}>
                    <Button
                      onClick={openSignupModal}
                      className={{ button: baphStyles.signupButton }}
                      kind="secondary"
                      size="medium"
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={openLoginModal}
                      className={{ button: baphStyles.loginButton }}
                      kind="primary"
                      size="medium"
                    >
                      Log in
                    </Button>
                  </div>
                ) : (
                  <Button
                    kind="primary"
                    className={{ button: baphStyles.loginButton }}
                    onClick={logOut}
                    size="medium"
                  >
                    Log out
                  </Button>
                )}
              </div>
            </div>
          </InnerWidth>
        </Block>
      </Header>

      {/* Signup Modal */}
      <Modal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Create Your Account"
        showCloseButton
      >
        <SignupForm onSuccess={handleSignupSuccess} onError={handleSignupError} />
      </Modal>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        title="Log In"
        showCloseButton
      >
        <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
      </Modal>
    </>
  );
};

const baphStyles = {
  header: {
    width: '100%',
    height: '75px',
    backgroundColor: baphColors.headerBackground,
    margin: '0 !important',
    marginBottom: '0 !important',
    padding: '0',
    display: 'flex',
    alignItems: 'center'
  },
  innerWidth: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    width: '100%',
    display: 'flex'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    margin: 0,
    ...baphTypography.styles.h1,
    '& a': {
      color: baphColors.lightText,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none'
      }
    }
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  favicon: {
    width: '64px',
    height: '64px',
    objectFit: 'contain' as const
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  signupButton: {
    ...baphTypography.styles.button
  },
  button: {
    position: 'relative' as const
  },
  addButton: {
    position: 'relative' as const,
    backgroundColor: baphColors.accent,
    '&:hover': {
      backgroundColor: baphColors.accent,
      opacity: 0.9
    }
  },
  loginButton: {
    ...baphTypography.styles.button
  },
  navButtonGroup: {
    // Custom styles for the navigation button group
  },
  modalContent: {
    padding: '2rem',
    minWidth: '400px'
  },
  modalTitle: {
    ...baphTypography.styles.h2,
    color: baphColors.lightText,
    marginBottom: '1.5rem',
    marginTop: 0
  },
  logInLogOut: {
    ...baphTypography.styles.button
  }
};
