import { Button, ButtonGroup, Header } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useScreenSize } from '../hooks/useScreenSize';
import { PlusSignIcon } from 'hugeicons-react';
import { isAuthenticatedVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client';

interface HeadingProps {
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
}

export const Heading: React.FC<HeadingProps> = ({
  setShowLoginModal,
  setShowSignupModal
}) => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  const handleAddMovies = () => {
    navigate('/add-movies');
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const logOut = () => {
    localStorage.removeItem('baphomet-token');
    localStorage.removeItem('baphomet-user');
    isAuthenticatedVar(false);
  };

  return (
    <Header>
      {[
        <div key="header-content" style={baphStyles.headerContent}>
          <Link
            to={'/'}
            data-testid="home-link"
            style={baphStyles.logoLink}
            aria-label="Baphomet - Go to homepage"
          >
            <h1>Baphomet</h1>
            <img
              src="/baphy-favicon.png"
              alt="Baphomet logo"
              style={baphStyles.favicon}
              role="presentation"
              aria-hidden="true"
            />
          </Link>

          <div css={baphStyles.rightSideContent}>
            <nav
              css={baphStyles.nav}
              role="navigation"
              aria-label="Main navigation"
            >
              <ButtonGroup ariaLabel="Navigation buttons">
                <Button
                  size="small"
                  kind="ghostOnDark"
                  onClick={() => navigate('/arena')}
                  ariaLabel="Go to Arena page"
                >
                  Arena
                </Button>
                <Button
                  size="small"
                  kind="ghostOnDark"
                  onClick={() => navigate('/leaderboards')}
                  ariaLabel="Go to Leader Boards page"
                  disabled
                >
                  Leader Boards
                </Button>
                <Button
                  size="small"
                  kind="ghostOnDark"
                  onClick={() => navigate('/all-movies')}
                  ariaLabel="Go to All Movies page"
                >
                  All Movies
                </Button>
              </ButtonGroup>
            </nav>

            {isAuthenticated && (
              <ButtonGroup ariaLabel="User actions">
                <Button
                  dataTestId="add-new-movie-button"
                  size="small"
                  // onClick={navToCreate}
                  icon={<PlusSignIcon size={17} strokeWidth={'3px'} />}
                  iconOnly={screenSize === 'small'}
                  kind="secondary"
                  ariaLabel={
                    screenSize === 'small' ? 'Add new movie' : undefined
                  }
                  onClick={handleAddMovies}
                >
                  {screenSize === 'small' ? (
                    <span className="sr-only">Add new movie</span>
                  ) : (
                    'Add new movie'
                  )}
                </Button>
                <Button
                  kind="primary"
                  onClick={logOut}
                  size="small"
                  ariaLabel="Sign out of your account"
                  dataTestId="logout-button"
                >
                  Log out
                </Button>
              </ButtonGroup>
            )}

            {/* Signup/Login buttons - only when not authenticated */}
            {!isAuthenticated && (
              <>
                <ButtonGroup ariaLabel="Authentication options">
                  <Button
                    onClick={openSignupModal}
                    kind="secondary"
                    size="small"
                    ariaLabel="Open sign up form"
                    ariaDescribedBy="signup-help"
                    dataTestId="signup-button"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={openLoginModal}
                    kind="primary"
                    size="small"
                    ariaLabel="Open log in form"
                    ariaDescribedBy="login-help"
                    dataTestId="login-button"
                  >
                    Log in
                  </Button>
                </ButtonGroup>
                {/* Hidden helper text for screen readers */}
                <span id="signup-help" css={baphStyles.srOnly}>
                  Create a new account to add and rate movies
                </span>
                <span id="login-help" css={baphStyles.srOnly}>
                  Sign in to your existing account
                </span>
              </>
            )}
          </div>
        </div>
      ]}
    </Header>
  );
};

// Define base styles
const baphStyles = {
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0 20px'
  },
  logo: {
    margin: 0,
    textDecoration: 'none'
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  favicon: {
    width: '64px',
    height: '64px',
    objectFit: 'contain' as const
  },
  rightSideContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
    justifyContent: 'flex-end'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  button: {
    position: 'relative' as const
  },
  srOnly: {
    position: 'absolute' as const,
    visibility: 'hidden' as const
  }
};
