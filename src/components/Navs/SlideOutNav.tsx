import { Avatar, SlideOutMenu } from '@collinlucke/phantomartist';
import { MainNavLinks } from './MainNavLinks';
import { LogoLink } from '../LogoLink';
import { UserMenu } from '../UserMenu';
import { UnauthorizedButtons } from './UnauthorizedButtons';
import {
  showSlideOutMenuVar,
  isAuthenticatedVar,
  isMobileVar
} from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

type SlideOutNavProps = {
  displayName: string;
};

export const SlideOutNav = ({ displayName }: SlideOutNavProps) => {
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isMobile = useReactiveVar(isMobileVar);

  return (
    <SlideOutMenu
      showSlideOut={showSlideOutMenu}
      setShowSlideOut={showSlideOutMenuVar}
    >
      {isMobile && <LogoLink />}
      <MainNavLinks />
      <hr css={baphStyles.divider} />
      {isAuthenticated && (
        <Avatar
          displayName={displayName}
          className={{ avatar: baphStyles.avatar }}
        />
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
