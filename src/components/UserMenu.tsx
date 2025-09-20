import { CSSObject } from '@emotion/react';
import { Button, ButtonGroup } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client/react';
import { logout } from '../utils/logout';
import { isAuthenticatedVar, isLargeScreenVar } from '../reactiveVars';

type UserMenuProps = {
  setShowUserDropdown?: (show: boolean) => void;
};

export const UserMenu: React.FC<UserMenuProps> = ({ setShowUserDropdown }) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isLargeScreen = useReactiveVar(isLargeScreenVar);
  const buttonSize = isLargeScreen ? 'small' : 'medium';
  const buttonVariant = isLargeScreen ? 'ghost' : 'ghostOnDark';

  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const logOutHandler = () => {
    if (setShowUserDropdown) setShowUserDropdown(false);
    logout();
  };

  return (
    <ButtonGroup
      className={{ buttonGroup: getUserMenuStyles(isLargeScreen) }}
      direction="vertical"
    >
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={{ button: getButtonStyles(isLargeScreen) }}
      >
        Profile
      </Button>
      {isAuthenticated && user && user.role === 'admin' && (
        <Link to="/add-movies">
          <Button
            variant={buttonVariant}
            size={buttonSize}
            className={{ button: getButtonStyles(isLargeScreen) }}
          >
            Add Movie
          </Button>
        </Link>
      )}
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={{ button: getButtonStyles(isLargeScreen) }}
        onClick={logOutHandler}
      >
        Logout
      </Button>
    </ButtonGroup>
  );
};

const getUserMenuStyles = (isLargeScreen: boolean) => {
  return {
    ...baphStyles.userMenu,
    ...(!isLargeScreen
      ? {
          marginTop: '10px'
        }
      : {})
  };
};

const getButtonStyles = (isLargeScreen: boolean): CSSObject => {
  return {
    ...baphStyles.button,
    ...(!isLargeScreen
      ? {
          padding: '10px 0',
          justifyContent: 'start' as const
        }
      : {})
  };
};

const baphStyles: { [key: string]: CSSObject } = {
  userMenu: {
    display: 'flex'
  },
  button: {
    width: '100%',
    '&:hover': {
      backgroundColor: 'none',
      boxShadow: 'none'
    }
  }
};
