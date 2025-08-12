import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Header,
  mediaQueries
} from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusSignIcon, Menu01Icon, Cancel01Icon } from 'hugeicons-react';
import { isAuthenticatedVar, isMobileAndLandscapeVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client';
import { CSSObject } from '@emotion/react';

type HeadingProps = {
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
};

export const Heading: React.FC<HeadingProps> = ({
  setShowLoginModal,
  setShowSignupModal
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isMobileAndLandscape = useReactiveVar(isMobileAndLandscapeVar);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const handleAddMovies = () => {
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setIsMobileMenuOpen(false); // Close menu after action
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMobileMenuOpen(false); // Close menu after action
  };

  const logOut = () => {
    localStorage.removeItem('baphomet-token');
    localStorage.removeItem('baphomet-user');
    isAuthenticatedVar(false);
    setIsMobileMenuOpen(false); // Close menu after action
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFloatingMenu = () => {
    setIsFloatingMenuOpen(!isFloatingMenuOpen);
  };
  // If mobile landscape, render floating hamburger menu instead
  if (isMobileAndLandscape && location.pathname === '/arena') {
    return (
      <>
        {/* Floating Hamburger Button */}
        <div css={baphStyles.floatingMenuButton}>
          <Button
            kind="primary"
            size="small"
            iconOnly
            icon={
              isFloatingMenuOpen ? (
                <Cancel01Icon size={20} />
              ) : (
                <Menu01Icon size={20} />
              )
            }
            onClick={toggleFloatingMenu}
            ariaLabel={isFloatingMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </div>

        {/* Floating Menu Overlay */}
        {isFloatingMenuOpen && (
          <div
            css={baphStyles.floatingMenuOverlay}
            className="floating-menu-overlay"
            onClick={() => setIsFloatingMenuOpen(false)}
          >
            <div
              css={baphStyles.floatingMenu}
              onClick={e => e.stopPropagation()}
            >
              {/* Logo/Title */}
              <div css={baphStyles.floatingMenuHeader}>
                <Link
                  to={'/'}
                  css={baphStyles.floatingLogoLink}
                  onClick={() => setIsFloatingMenuOpen(false)}
                >
                  <h2 css={baphStyles.floatingTitle}>Baphomet</h2>
                  <img
                    src="/baphy-favicon.png"
                    alt="Baphomet logo"
                    css={baphStyles.floatingFavicon}
                  />
                </Link>
              </div>

              {/* Navigation */}
              <nav css={baphStyles.floatingNav}>
                <div css={baphStyles.floatingNavSection}>
                  <Button
                    size="medium"
                    kind="ghostOnDark"
                    onClick={() => handleNavigation('/arena')}
                    className={{ button: baphStyles.floatingNavButton }}
                  >
                    Arena
                  </Button>
                  <Button
                    size="medium"
                    kind="ghostOnDark"
                    onClick={() => handleNavigation('/leaderboards')}
                    disabled
                    className={{ button: baphStyles.floatingNavButton }}
                  >
                    Leader Boards
                  </Button>
                  <Button
                    size="medium"
                    kind="ghostOnDark"
                    onClick={() => handleNavigation('/all-movies')}
                    className={{ button: baphStyles.floatingNavButton }}
                  >
                    All Movies
                  </Button>
                </div>

                {isAuthenticated && user.role === 'admin' && (
                  <div css={baphStyles.floatingNavSection}>
                    <Button
                      size="medium"
                      kind="secondary"
                      onClick={() => {
                        handleNavigation('/add-movies');
                        handleAddMovies();
                      }}
                      icon={<PlusSignIcon size={20} strokeWidth={'3px'} />}
                      className={{ button: baphStyles.floatingNavButton }}
                    >
                      Add new movie
                    </Button>
                    <Button
                      kind="primary"
                      onClick={logOut}
                      size="medium"
                      className={{ button: baphStyles.floatingNavButton }}
                    >
                      Log out
                    </Button>
                  </div>
                )}

                {!isAuthenticated && (
                  <div css={baphStyles.floatingNavSection}>
                    <Button
                      onClick={openSignupModal}
                      kind="secondary"
                      size="medium"
                      className={{ button: baphStyles.floatingNavButton }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={openLoginModal}
                      kind="primary"
                      size="medium"
                      className={{ button: baphStyles.floatingNavButton }}
                    >
                      Log in
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  // Regular header for non-mobile-landscape devices

  return (
    <Header>
      {[
        <div key="header-content" css={baphStyles.headerContent}>
          <Link
            to={'/'}
            data-testid="home-link"
            css={baphStyles.logoLink}
            aria-label="Baphomet - Go to homepage"
          >
            <h1 css={baphStyles.title}>Baphomet</h1>
            <img
              src="/baphy-favicon.png"
              alt="Baphomet logo"
              css={baphStyles.favicon}
              role="presentation"
              aria-hidden="true"
            />
          </Link>

          {/* Desktop Navigation - hidden on mobile via CSS */}
          <div css={baphStyles.rightSideContent}>
            <nav
              css={baphStyles.nav}
              role="navigation"
              aria-label="Main navigation"
            >
              <ButtonGroup ariaLabel="Navigation buttons">
                <Link to="/arena">
                  <Button
                    size="small"
                    kind="ghostOnDark"
                    onClick={() => handleNavigation('/arena')}
                    ariaLabel="Go to Arena page"
                  >
                    Arena
                  </Button>
                </Link>
                {/* <Link to="/leaderboards" > */}
                <Button
                  size="small"
                  kind="ghostOnDark"
                  ariaLabel="Go to Leader Boards page"
                  disabled
                >
                  Leader Boards
                </Button>
                {/* </Link> */}
                <Link to="/all-movies">
                  <Button
                    size="small"
                    kind="ghostOnDark"
                    ariaLabel="Go to All Movies page"
                  >
                    All Movies
                  </Button>
                </Link>
              </ButtonGroup>
            </nav>

            {isAuthenticated && user.role === 'admin' && (
              <ButtonGroup ariaLabel="User actions">
                <Link to="/add-movies">
                  <Button
                    dataTestId="add-new-movie-button"
                    size="small"
                    icon={<PlusSignIcon size={17} strokeWidth={'3px'} />}
                    kind="secondary"
                    ariaLabel="Add new movie"
                    onClick={handleAddMovies}
                  >
                    Add new movie
                  </Button>
                </Link>
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
                <span id="signup-help" css={baphStyles.srOnly}>
                  Create a new account to add and rate movies
                </span>
                <span id="login-help" css={baphStyles.srOnly}>
                  Sign in to your existing account
                </span>
              </>
            )}
          </div>

          {/* Mobile Controls - shown only on mobile via CSS */}
          <div css={baphStyles.mobileControls}>
            <Button
              kind="ghostOnDark"
              size="small"
              iconOnly
              icon={
                isMobileMenuOpen ? (
                  <Cancel01Icon size={24} />
                ) : (
                  <Menu01Icon size={24} />
                )
              }
              onClick={toggleMobileMenu}
              ariaLabel={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            />
          </div>

          {/* Mobile Menu Overlay - shown only when menu is open */}
          {isMobileMenuOpen && (
            <div
              css={baphStyles.mobileMenuOverlay}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                css={baphStyles.mobileMenu}
                onClick={e => e.stopPropagation()}
              >
                <nav
                  css={baphStyles.mobileNav}
                  role="navigation"
                  aria-label="Mobile navigation"
                >
                  <div css={baphStyles.mobileNavSection}>
                    <Button
                      size="medium"
                      kind="ghostOnDark"
                      onClick={() => handleNavigation('/arena')}
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      Arena
                    </Button>
                    <Button
                      size="medium"
                      kind="ghostOnDark"
                      onClick={() => handleNavigation('/leaderboards')}
                      disabled
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      Leader Boards
                    </Button>
                    <Button
                      size="medium"
                      kind="ghostOnDark"
                      onClick={() => handleNavigation('/all-movies')}
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      All Movies
                    </Button>
                  </div>

                  {isAuthenticated && user.role === 'admin' && (
                    <div css={baphStyles.mobileNavSection}>
                      <Link to="/add-movies">
                        <Button
                          size="medium"
                          kind="secondary"
                          onClick={handleAddMovies}
                          icon={<PlusSignIcon size={20} strokeWidth={'3px'} />}
                          className={{ button: baphStyles.mobileNavButton }}
                        >
                          Add new movie
                        </Button>
                      </Link>
                      <Button
                        kind="primary"
                        onClick={logOut}
                        size="medium"
                        className={{ button: baphStyles.mobileNavButton }}
                      >
                        Log out
                      </Button>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div css={baphStyles.mobileNavSection}>
                      <Button
                        onClick={openSignupModal}
                        kind="secondary"
                        size="medium"
                        className={{ button: baphStyles.mobileNavButton }}
                      >
                        Sign Up
                      </Button>
                      <Button
                        onClick={openLoginModal}
                        kind="primary"
                        size="medium"
                        className={{ button: baphStyles.mobileNavButton }}
                      >
                        Log in
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      ]}
    </Header>
  );
};

// Define base styles with mobile responsiveness
const baphStyles: { [key: string]: CSSObject } = {
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0 15px',
    [mediaQueries.minWidth.sm]: {
      padding: '0 20px'
    }
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    [mediaQueries.minWidth.sm]: {
      gap: '8px'
    },
    [mediaQueries.minWidth.md]: {
      gap: '10px'
    },
    [mediaQueries.minWidth.lg]: {
      gap: '12px'
    }
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    [mediaQueries.minWidth.sm]: {
      fontSize: '1.4rem'
    },
    [mediaQueries.minWidth.md]: {
      fontSize: '1.6rem'
    },
    [mediaQueries.minWidth.lg]: {
      fontSize: '2rem'
    }
  },
  favicon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain' as const,
    [mediaQueries.minWidth.sm]: {
      width: '40px',
      height: '40px'
    },
    [mediaQueries.minWidth.md]: {
      width: '48px',
      height: '48px'
    },
    [mediaQueries.minWidth.lg]: {
      width: '64px',
      height: '64px'
    }
  },
  rightSideContent: {
    display: 'none', // Hidden on mobile by default
    alignItems: 'center',
    gap: '15px',
    flex: 1,
    justifyContent: 'flex-end',
    [mediaQueries.minWidth.md]: {
      display: 'flex', // Show on desktop (640px+)
      gap: '20px'
    }
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    [mediaQueries.minWidth.md]: {
      gap: '20px'
    }
  },
  mobileControls: {
    display: 'flex', // Show on mobile by default
    alignItems: 'center',
    [mediaQueries.minWidth.md]: {
      display: 'none' // Hide on desktop (640px+)
    }
  },
  mobileMenuOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  mobileMenu: {
    backgroundColor: '#0B1828', // Using primary color
    width: '280px',
    height: '100%',
    padding: '20px',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto' as const
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    paddingTop: '60px' // Account for header height
  },
  mobileNavSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '20px',
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  mobileNavButton: {
    width: '100%',
    justifyContent: 'flex-start'
  },
  srOnly: {
    position: 'absolute' as const,
    visibility: 'hidden' as const
  },

  // Floating menu styles for mobile landscape
  floatingMenuButton: {
    position: 'fixed' as const,
    top: '10px',
    right: '10px',
    zIndex: 1001,
    backgroundColor: 'rgba(11, 24, 40, 0.9)', // Semi-transparent primary color
    borderRadius: '50%',
    padding: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  floatingMenuOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingMenu: {
    backgroundColor: '#0B1828',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '320px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  floatingMenuHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  floatingLogoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: 'inherit'
  },
  floatingTitle: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#FFFFFF'
  },
  floatingFavicon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain' as const
  },
  floatingNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  floatingNavSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '15px',
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  floatingNavButton: {
    width: '100%',
    justifyContent: 'flex-start'
  }
};
