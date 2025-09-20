import {
  Header,
  mediaQueries,
  SlideOutMenu,
  Button
} from '@collinlucke/phantomartist';
import { Menu01Icon } from 'hugeicons-react';
import { LogoLink } from './LogoLink';
import {
  showSlideOutMenuVar,
  isLargeScreenVar,
  isMobileVar
} from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { MainNav } from './Navs/MainNav';

export const Heading: React.FC = () => {
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);
  const isLargeScreen = useReactiveVar(isLargeScreenVar);
  const isMobile = useReactiveVar(isMobileVar);

  const MenuIconButton = () => (
    <Button
      variant="ghostOnDark"
      size="small"
      iconOnly
      icon={<Menu01Icon size={24} />}
      onClick={() => showSlideOutMenuVar(true)}
      ariaLabel={showSlideOutMenu ? 'Close menu' : 'Open menu'}
      className={{ button: getOpenButtonStyles(isMobile) }}
    />
  );

  const MainNavSlideOut = () => (
    <SlideOutMenu
      showSlideOut={showSlideOutMenu}
      setShowSlideOut={showSlideOutMenuVar}
    >
      <MainNav />
    </SlideOutMenu>
  );

  return (
    <>
      {isMobile ? (
        <header>
          {MenuIconButton()}
          {MainNavSlideOut()}
        </header>
      ) : (
        <Header>
          <div key="header-content" css={baphStyles.headerContent}>
            <LogoLink />
            {!isLargeScreen ? (
              <div>
                {MenuIconButton()}
                {MainNavSlideOut()}
              </div>
            ) : (
              <>
                <MainNav />
              </>
            )}
          </div>
        </Header>
      )}
    </>
  );
};

const getOpenButtonStyles = (isMobile: boolean): CSSObject => {
  return {
    ...baphStyles.openButton,
    ...(isMobile ? { position: 'absolute', top: '16px', right: '16px' } : {})
  };
};

const baphStyles: { [key: string]: CSSObject } = {
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
  openButton: {
    padding: '16px',
    zIndex: 10,
    '&:hover': { boxShadow: 'none' }
  }
};
