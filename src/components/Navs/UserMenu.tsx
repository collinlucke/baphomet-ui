import { CSSObject } from '@emotion/react';
import { ButtonGroup } from 'athameui';
import { isAuthenticatedVar, isSmallOrMobileVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { logout } from '../../utils/logout';
import { NavMenuButton } from '../NavMenuButton';

type UserMenuProps = {
  setShowUserDropdown?: (show: boolean) => void;
};

export const UserMenu = ({ setShowUserDropdown }: UserMenuProps) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const variant = !isSmallOrMobile ? 'ghost' : undefined;

  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const logOutHandler = () => {
    if (setShowUserDropdown) setShowUserDropdown(false);
    logout();
  };

  return (
    <ButtonGroup
      sx={{ buttonGroup: getUserMenuStyles(isSmallOrMobile) }}
      direction="column"
    >
      <NavMenuButton to="/profile" variant={variant}>
        Profile
      </NavMenuButton>

      {isAuthenticated && user && user.role === 'admin' && (
        <NavMenuButton to="/add-movies" variant={variant}>
          Add Movie
        </NavMenuButton>
      )}

      <NavMenuButton onClick={logOutHandler} variant={variant}>
        Logout
      </NavMenuButton>
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
      : { gap: 0 })
  };
};
