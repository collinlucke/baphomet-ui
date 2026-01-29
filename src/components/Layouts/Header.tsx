import { Header as AthameHeader, Button, tokens } from 'athameui';
import {HugeiconsIcon} from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { LogoLink } from './LogoLink';
import {
  showSlideOutMenuVar,
  isLargeScreenVar,
  isMobileVar,
  isSmallOrMobileVar,
  isAuthenticatedVar
} from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { MainNavLinks } from '../MainNavLinks';
import { SlideOutNav } from '../Navs/SlideOutNav';
import { AuthUserAvatarButton } from '../Navs/AuthUserAvatarButton';
import { UnauthorizedButtons } from '../Navs/UnauthorizedButtons';

export const Header: React.FC = () => {
  const isLargeScreen = useReactiveVar(isLargeScreenVar);
  const isMobile = useReactiveVar(isMobileVar);
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const openSlideOutMenuHandler = () => {
    if (isSmallOrMobile) {
      showSlideOutMenuVar(true);
    }
  };

  return (
    <AthameHeader>
      <div css={baphStyles.headerContent}>
        <nav css={baphStyles.nav}>
          <LogoLink />

          <div css={baphStyles.rightContent}>
            {isMobile || !isLargeScreen ? (
              <div css={baphStyles.rightContent}>
                <Button
                  title="Open main menu flyout"
                  data-testid="open-slide-out-menu-button"
                  variant="ghost"
                  size="small"
                  icon={() => <HugeiconsIcon icon={Menu01Icon} size={24} />}
                  onClick={openSlideOutMenuHandler}
                  aria-label={'Open main menu flyout'}
                  dark
                />
                <SlideOutNav displayName={user?.displayName} />
              </div>
            ) : (
              <>
                <MainNavLinks />
                {isAuthenticated ? (
                  <AuthUserAvatarButton displayName={user?.displayName} />
                ) : (
                  <UnauthorizedButtons />
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </AthameHeader>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 15px',
    width: '100%'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  rightContent: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'center',
    [tokens.media.min.lg]: {
      gap: '20px'
    }
  }
};
