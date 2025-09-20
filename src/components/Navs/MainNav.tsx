import { useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  mediaQueries,
  Dropdown,
  Avatar
} from '@collinlucke/phantomartist';
import { LogoLink } from '../LogoLink';
import { UserMenu } from '../UserMenu';
import { useReactiveVar } from '@apollo/client/react';
import {
  isMobileVar,
  isAuthenticatedVar,
  showSlideOutMenuVar,
  showSignUpModalVar,
  showLoginModalVar,
  isLargeScreenVar
} from '../../reactiveVars';
import { Link } from 'react-router-dom';

// TODO: This could use some clean up/refactoring/optimization
export const MainNav: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const isMobile = useReactiveVar(isMobileVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const isLargeScreen = useReactiveVar(isLargeScreenVar);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const buttonSize = isLargeScreen && !isMobile ? 'small' : 'medium';
  const showLoginModalHandler = () => {
    showLoginModalVar(true);
    showSlideOutMenuVar(false);
  };

  const showSignUpModalHandler = () => {
    showSignUpModalVar(true);
    showSlideOutMenuVar(false);
  };

  const toggleDropdownHandler = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const closeDropdownHandler = () => {
    setShowUserDropdown(false);
  };

  const closeSlideOutMenu = () => {
    showSlideOutMenuVar(false);
  };

  return (
    <nav css={baphStyles.nav} aria-label="Main navigation">
      <ButtonGroup
        className={{
          buttonGroup: getNavButtonGroupStyles(isLargeScreen, isMobile)
        }}
        direction={isLargeScreen && !isMobile ? 'horizontal' : 'vertical'}
      >
        <>
          {isMobile && <LogoLink />}
          <Link to="/arena">
            <Button
              size={buttonSize}
              variant="ghostOnDark"
              ariaLabel="Go to Arena page"
              className={{ button: baphStyles.button }}
              onClick={
                !isLargeScreen || isMobile ? closeSlideOutMenu : undefined
              }
            >
              Arena
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button
              size={buttonSize}
              variant="ghostOnDark"
              ariaLabel="Go to Leaderboard page"
              className={{ button: baphStyles.button }}
              onClick={
                !isLargeScreen || isMobile ? closeSlideOutMenu : undefined
              }
            >
              Leaderboard
            </Button>
          </Link>
          <Link to="/all-movies">
            <Button
              size={buttonSize}
              variant="ghostOnDark"
              ariaLabel="Go to All Movies page"
              className={{ button: baphStyles.button }}
              onClick={
                !isLargeScreen || isMobile ? closeSlideOutMenu : undefined
              }
            >
              All Movies
            </Button>
          </Link>
          <Link to="/faq">
            <Button
              size={buttonSize}
              variant="ghostOnDark"
              ariaLabel="Go to FAQ page"
              className={{ button: baphStyles.button }}
              onClick={
                !isLargeScreen || isMobile ? closeSlideOutMenu : undefined
              }
            >
              FAQ
            </Button>
          </Link>
          {!isLargeScreen && <hr css={baphStyles.divider} />}
        </>
        <ButtonGroup
          className={{ buttonGroup: baphStyles.authButtonGroup }}
          ariaLabel="User actions"
        >
          {isAuthenticated ? (
            <>
              <div css={baphStyles.userMenu} ref={dropdownRef}>
                <Button
                  onClick={toggleDropdownHandler}
                  variant="ghost"
                  className={{ button: getAvatarButtonStyles(isLargeScreen) }}
                >
                  <Avatar displayName="User Name Placeholder" />
                </Button>
                {!showSlideOutMenu ? (
                  <Dropdown
                    showDropdown={showUserDropdown}
                    className={{ dropdownWrapper: baphStyles.dropdown }}
                    closeDropdown={closeDropdownHandler}
                    dropdownRef={dropdownRef}
                  >
                    <UserMenu setShowUserDropdown={setShowUserDropdown} />
                  </Dropdown>
                ) : (
                  <UserMenu />
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={showSignUpModalHandler}
                variant="secondary"
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
                variant="primary"
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

const getNavButtonGroupStyles = (
  isLargeScreen: boolean,
  isMobile: boolean
) => ({
  ...baphStyles.navButtonGroup,
  ...(!isLargeScreen || isMobile
    ? {
        alignItems: 'flex-start' as const
      }
    : { alignItems: 'center' as const })
});

const getAvatarButtonStyles = (isLargeScreen: boolean) => {
  return {
    ...baphStyles.avatarButton,
    ...(isLargeScreen ? {} : { cursor: 'default' })
  };
};

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
  },
  userMenu: {
    position: 'relative' as const
  },
  avatarButton: {
    padding: 0,
    borderRadius: '50%'
  },
  dropdown: {
    top: 'calc(100% + 8px)',
    right: 0
  }
};
