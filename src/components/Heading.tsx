import { useState } from 'react';
import {
  baseColors,
  Button,
  ButtonGroup,
  Header,
  mediaQueries,
  hexToRgba
} from '@collinlucke/phantomartist';
import { Footer } from './Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PlusSignIcon, Menu01Icon, Cancel01Icon } from 'hugeicons-react';
import { isAuthenticatedVar, isMobileAndLandscapeVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
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
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isMobileAndLandscape = useReactiveVar(isMobileAndLandscapeVar);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const handleAddMovies = () => {
    setIsMobileMenuOpen(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setIsMobileMenuOpen(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMobileMenuOpen(false);
  };

  const logOut = () => {
    localStorage.removeItem('baphomet-token');
    localStorage.removeItem('baphomet-user');
    isAuthenticatedVar(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFloatingMenu = () => {
    setIsFloatingMenuOpen(!isFloatingMenuOpen);
  };

  if (isMobileAndLandscape && location.pathname === '/arena') {
    return (
      <>
        {/* Floating Menu Button */}
        <div css={baphStyles.floatingMenuButtonContainer}>
          <Button
            kind="primary"
            size="small"
            iconOnly
            icon={
              isFloatingMenuOpen ? (
                <Cancel01Icon size={20} />
              ) : (
                <img
                  src="/baphy-favicon.png"
                  alt="Baphomet logo"
                  css={baphStyles.floatingFavicon}
                />
              )
            }
            onClick={toggleFloatingMenu}
            ariaLabel={isFloatingMenuOpen ? 'Close menu' : 'Open menu'}
            className={{ button: baphStyles.floatingMenuButton }}
          />
        </div>

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
                    onClick={() => handleNavigation('/leaderboard')}
                    className={{ button: baphStyles.floatingNavButton }}
                  >
                    Leaderboard
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
                <Link to="/leaderboard">
                  <Button
                    size="small"
                    kind="ghostOnDark"
                    ariaLabel="Go to Leaderboard page"
                  >
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/all-movies">
                  <Button
                    size="small"
                    kind="ghostOnDark"
                    ariaLabel="Go to All Movies page"
                  >
                    All Movies
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button
                    size="small"
                    kind="ghostOnDark"
                    ariaLabel="Go to FAQ page"
                  >
                    FAQ
                  </Button>
                </Link>
              </ButtonGroup>
            </nav>

            {isAuthenticated && (
              <ButtonGroup ariaLabel="User actions">
                <>
                  {user.role === 'admin' ? (
                    <Link to="/add-movies">
                      <Button
                        testId="add-new-movie-button"
                        size="small"
                        icon={<PlusSignIcon size={17} strokeWidth={'3px'} />}
                        kind="secondary"
                        ariaLabel="Add new movie"
                        onClick={handleAddMovies}
                      >
                        Add new movie
                      </Button>
                    </Link>
                  ) : null}
                </>
                <Button
                  kind="primary"
                  onClick={logOut}
                  size="small"
                  ariaLabel="Sign out of your account"
                  testId="logout-button"
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
                    testId="signup-button"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={openLoginModal}
                    kind="primary"
                    size="small"
                    ariaLabel="Open log in form"
                    ariaDescribedBy="login-help"
                    testId="login-button"
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

          {isMobileMenuOpen && (
            <div
              css={baphStyles.mobileMenuOverlay}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                className={{ button: baphStyles.closeMenuButton }}
                onClick={toggleMobileMenu}
                ariaLabel="Close modal"
                kind="ghost"
                size="medium"
                iconOnly
                icon={<Cancel01Icon size={24} />}
              />

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
                      onClick={() => handleNavigation('/leaderboard')}
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      Leaderboards
                    </Button>
                    <Button
                      size="medium"
                      kind="ghostOnDark"
                      onClick={() => handleNavigation('/all-movies')}
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      All Movies
                    </Button>
                    <Button
                      size="medium"
                      kind="ghostOnDark"
                      onClick={() => handleNavigation('/faq')}
                      className={{ button: baphStyles.mobileNavButton }}
                    >
                      FAQ
                    </Button>
                  </div>

                  {isAuthenticated && (
                    <div css={baphStyles.mobileNavSection}>
                      {user.role === 'admin' ? (
                        <Link to="/add-movies">
                          <Button
                            size="medium"
                            kind="secondary"
                            onClick={handleAddMovies}
                            icon={
                              <PlusSignIcon size={20} strokeWidth={'3px'} />
                            }
                            className={{ button: baphStyles.mobileNavButton }}
                          >
                            Add new movie
                          </Button>
                        </Link>
                      ) : null}

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
                <Footer />
              </div>
            </div>
          )}
        </div>
      ]}
    </Header>
  );
};

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
    fontSize: '1.5rem',
    [mediaQueries.minWidth.md]: {
      fontSize: '1.6rem'
    },
    [mediaQueries.minWidth.lg]: {
      fontSize: '2rem'
    }
  },
  favicon: {
    width: '40px',
    height: '40px',
    objectFit: 'contain' as const,
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
    display: 'none',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
    justifyContent: 'flex-end',
    [mediaQueries.minWidth.lg]: {
      display: 'flex',
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
    display: 'flex',
    alignItems: 'center',
    [mediaQueries.minWidth.lg]: {
      display: 'none'
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
    backgroundColor: baseColors.primary[500],
    width: '280px',
    height: '100%',
    padding: '20px',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between'
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    paddingTop: '60px'
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
  closeMenuButton: {
    color: baseColors.tertiary[50],
    position: 'absolute' as const,
    top: '20px',
    right: '20px'
  },
  srOnly: {
    position: 'absolute' as const,
    visibility: 'hidden' as const
  },

  floatingMenuButtonContainer: {
    position: 'fixed' as const,
    top: '10px',
    right: '10px',
    zIndex: 1001,
    backgroundColor: hexToRgba(baseColors.secondary[600], 0.5),
    borderRadius: '50%',
    padding: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  floatingMenuButton: {
    backgroundColor: 'transparent',
    padding: '0'
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
    width: '30px',
    height: '30px',
    objectFit: 'contain' as const,
    backgroundColor: 'transparent'
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
