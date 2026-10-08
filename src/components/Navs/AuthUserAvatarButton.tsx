import { useState } from 'react';
import { Avatar, Button, Dropdown } from 'athameui';
import { UserMenu } from './UserMenu';

type AuthUserAvatarProps = {
  displayName: string | null;
};

export const AuthUserAvatarButton = ({ displayName }: AuthUserAvatarProps) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const closeDropdownHandler = () => {
    setShowUserDropdown(false);
  };

  return (
    <div css={baphStyles.userMenu}>
      <Button
        onClick={toggleDropdownHandler}
        variant="ghost"
        sx={{ button: baphStyles.avatarButton }}
      >
        <Avatar displayName={displayName || 'User'} size="medium" />
      </Button>
      <Dropdown
        isOpen={showUserDropdown}
        sx={{ dropdown: baphStyles.dropdown }}
        onClose={closeDropdownHandler}
      >
        <UserMenu setShowUserDropdown={setShowUserDropdown} />
      </Dropdown>
    </div>
  );
};

const baphStyles = {
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
