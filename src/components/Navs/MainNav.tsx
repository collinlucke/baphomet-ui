import {
  Button,
  ButtonGroup,
  mediaQueries,
  screenSizes
} from '@collinlucke/phantomartist';
import { LogoLink } from '../LogoLink';
import { useReactiveVar } from '@apollo/client/react';
import {
  isMobileVar,
  isAuthenticatedVar,
  showSlideOutMenuVar,
  showSignUpModalVar,
  showLoginModalVar
} from '../../reactiveVars';
import { Link } from 'react-router-dom';

// TODO: This could use some clean up/refactoring/optimization
export const MainNav: React.FC = () => {
  const isMobile = useReactiveVar(isMobileVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const isLarge = window.innerWidth >= screenSizes.lg;
  const buttonSize = !showSlideOutMenu ? 'small' : 'medium';
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const logOutHandler = () => {
    localStorage.removeItem('baphomet-token');
    localStorage.removeItem('baphomet-user');
    isAuthenticatedVar(false);
    showSlideOutMenuVar(false);
  };

  const showLoginModalHandler = () => {
    showLoginModalVar(true);
    showSlideOutMenuVar(false);
  };

  const showSignUpModalHandler = () => {
    showSignUpModalVar(true);
    showSlideOutMenuVar(false);
  };

  return (
    <nav css={baphStyles.nav} aria-label="Main navigation">
      <ButtonGroup
        className={{ buttonGroup: getNavButtonGroupStyles(isMobile, isLarge) }}
      >
        <>
          {isMobile && <LogoLink />}
          <Link to="/arena">
            <Button
              size={buttonSize}
              kind="ghostOnDark"
              ariaLabel="Go to Arena page"
              className={{ button: baphStyles.button }}
            >
              Arena
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button
              size={buttonSize}
              kind="ghostOnDark"
              ariaLabel="Go to Leaderboard page"
              className={{ button: baphStyles.button }}
            >
              Leaderboard
            </Button>
          </Link>
          <Link to="/all-movies">
            <Button
              size={buttonSize}
              kind="ghostOnDark"
              ariaLabel="Go to All Movies page"
              className={{ button: baphStyles.button }}
            >
              All Movies
            </Button>
          </Link>
          <Link to="/faq">
            <Button
              size={buttonSize}
              kind="ghostOnDark"
              ariaLabel="Go to FAQ page"
              className={{ button: baphStyles.button }}
            >
              FAQ
            </Button>
          </Link>
          {isMobile && <hr css={baphStyles.divider} />}
        </>
        <ButtonGroup
          className={{ buttonGroup: baphStyles.authButtonGroup }}
          ariaLabel="User actions"
        >
          {isAuthenticated ? (
            <>
              {user.role === 'admin' && (
                <Link to="/add-movies">
                  <Button
                    testId="add-new-movie-button"
                    size={buttonSize}
                    kind="secondary"
                    ariaLabel="Add new movie"
                    className={{ button: baphStyles.noWrapButton }}
                  >
                    Add new movie
                  </Button>
                </Link>
              )}

              <Button
                kind="primary"
                onClick={logOutHandler}
                size={buttonSize}
                ariaLabel="Sign out of your account"
                testId="logout-button"
                className={{ button: baphStyles.noWrapButton }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={showSignUpModalHandler}
                kind="secondary"
                size={buttonSize}
                ariaLabel="Open sign up form"
                ariaDescribedBy="signup-help"
                testId="signup-button"
                className={{ button: baphStyles.noWrapButton }}
              >
                Sign Up
              </Button>
              <Button
                onClick={showLoginModalHandler}
                kind="primary"
                size={buttonSize}
                ariaLabel="Open log in form"
                ariaDescribedBy="login-help"
                testId="login-button"
                className={{ button: baphStyles.noWrapButton }}
              >
                Log in
              </Button>
              <span id="signup-help" css={baphStyles.srOnly}>
                Create a new account to add and rate movies
              </span>
              <span id="login-help" css={baphStyles.srOnly}>
                Sign in to your existing account
              </span>
            </>
          )}
        </ButtonGroup>
      </ButtonGroup>
    </nav>
  );
};

const getNavButtonGroupStyles = (isMobile: boolean, isLarge: boolean) => ({
  ...baphStyles.navButtonGroup,
  ...(isMobile || !isLarge
    ? {
        flexDirection: 'column' as const,
        alignItems: 'flex-start' as const
      }
    : { flexDirection: 'row' as const, alignItems: 'center' as const })
});

const baphStyles = {
  nav: {
    display: 'flex',
    gap: '15px',
    flexDirection: 'column' as const,
    [mediaQueries.minWidth.md]: {
      gap: '20px'
    }
  },
  navButtonGroup: {},
  button: {
    padding: '10px 0',
    whiteSpace: 'nowrap' as const,
    '&:hover': {
      boxShadow: 'none'
    }
  },
  authButtonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    [mediaQueries.minWidth.lg]: {
      flexDirection: 'row' as const
    }
  },
  noWrapButton: {
    whiteSpace: 'nowrap' as const
  },
  srOnly: {
    position: 'absolute' as const,
    visibility: 'hidden' as const
  },
  divider: {
    width: '100%'
  }
};
