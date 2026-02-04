import { SlideOutMenu } from 'phantomartist';
import { Avatar } from 'athameui';
import { MainNavLinks } from '../MainNavLinks';
import { UserMenu } from './UserMenu';
import { UnauthorizedButtons } from './UnauthorizedButtons';
import { showSlideOutMenuVar, isAuthenticatedVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

type SlideOutNavProps = {
  displayName: string;
};

export const SlideOutNav = ({ displayName }: SlideOutNavProps) => {
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  return (
    <SlideOutMenu
      showSlideOut={showSlideOutMenu}
      setShowSlideOut={showSlideOutMenuVar}
    >
      <MainNavLinks />
      <hr css={baphStyles.divider} />
      {isAuthenticated && (
        <Avatar displayName={displayName} sx={{ avatar: baphStyles.avatar }} />
      )}
      {isAuthenticated ? <UserMenu /> : <UnauthorizedButtons />}
    </SlideOutMenu>
  );
};

const baphStyles = {
  divider: {
    width: '100%'
  },
  avatar: {
    marginTop: '20px'
  }
};
