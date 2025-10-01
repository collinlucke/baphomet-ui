import { useState, useRef } from 'react';
import { Avatar, Button, Dropdown } from 'phantomartist';
import { UserMenu } from './UserMenu';

type AuthUserAvatarProps = {
  displayName: string | null;
};

export const AuthUserAvatarButton = ({ displayName }: AuthUserAvatarProps) => {
  const dropdownRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const closeDropdownHandler = () => {
    setShowUserDropdown(false);
  };

  return (
    <div css={baphStyles.userMenu} ref={dropdownRef}>
      <Button
        onClick={toggleDropdownHandler}
        variant="ghost"
        className={{ button: baphStyles.avatarButton }}
      >
        <Avatar displayName={displayName || 'User'} />
      </Button>
      <Dropdown
        showDropdown={showUserDropdown}
        className={{ dropdownWrapper: baphStyles.dropdown }}
        closeDropdown={closeDropdownHandler}
        dropdownRef={dropdownRef}
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
