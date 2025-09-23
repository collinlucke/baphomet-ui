import { CSSObject } from '@emotion/react';
import { ButtonGroup } from '@collinlucke/phantomartist';
import { isAuthenticatedVar, isSmallOrMobileVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { logout } from '../utils/logout';
import { NavMenuButton } from './NavMenuButton';

type UserMenuProps = {
  setShowUserDropdown?: (show: boolean) => void;
};

export const UserMenu: React.FC<UserMenuProps> = ({ setShowUserDropdown }) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);

  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const logOutHandler = () => {
    if (setShowUserDropdown) setShowUserDropdown(false);
    logout();
  };

  return (
    <ButtonGroup
      className={{ buttonGroup: getUserMenuStyles(isSmallOrMobile) }}
      direction="vertical"
    >
      <NavMenuButton>Profile</NavMenuButton>

      {isAuthenticated && user && user.role === 'admin' && (
        <NavMenuButton to="/add-movies">Add Movie</NavMenuButton>
      )}

      <NavMenuButton onClick={logOutHandler}>Logout</NavMenuButton>
    </ButtonGroup>
  );
};

const getUserMenuStyles = (isSmallOrMobile: boolean): CSSObject => {
  return {
    display: 'flex',
    ...(isSmallOrMobile
      ? {
          marginTop: '10px',
          alignItems: 'flex-start' as const
        }
      : {})
  };
};
