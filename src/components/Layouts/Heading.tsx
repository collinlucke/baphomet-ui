import { Header, mediaQueries, Button } from 'phantomartist';
import { Menu01Icon } from 'hugeicons-react';
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
import { MainNavLinks } from '../Navs/MainNavLinks';
import { SlideOutNav } from '../Navs/SlideOutNav';
import { AuthUserAvatarButton } from '../Navs/AuthUserAvatarButton';
import { UnauthorizedButtons } from '../Navs/UnauthorizedButtons';

export const Heading: React.FC = () => {
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

  const MenuIconButton = () => (
    <Button
      variant="ghostOnDark"
      size="small"
      iconOnly
      icon={<Menu01Icon size={24} />}
      onClick={openSlideOutMenuHandler}
      ariaLabel={'Open menu'}
      className={{ button: baphStyles.openButton }}
    />
  );

  return (
    <Header className={{ header: getHeaderStyes(isSmallOrMobile) }}>
      <div key="header-content" css={baphStyles.headerContent}>
        <nav css={baphStyles.nav}>
          <LogoLink />

          <div css={baphStyles.rightContent}>
            {isMobile || !isLargeScreen ? (
              <div css={baphStyles.rightContent}>
                <MenuIconButton />
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
    </Header>
  );
};

const getHeaderStyes = (isSmallOrMobile: boolean) => ({
  height: isSmallOrMobile ? '65px' : '75px'
});
const baphStyles: { [key: string]: CSSObject } = {
  header: {
    maxHeight: '55px'
  },
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
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    width: '100%'
  },
  openButton: {
    padding: '16px',
    zIndex: 10,
    '&:hover': { boxShadow: 'none' }
  },
  rightContent: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'center'
  }
};
