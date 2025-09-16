import { useEffect } from 'react';
import {
  Header,
  mediaQueries,
  SlideOutMenu,
  screenSizes
} from '@collinlucke/phantomartist';
import { LogoLink } from './LogoLink';
import { showSlideOutMenuVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { CSSObject } from '@emotion/react';
import { MainNav } from './Navs/MainNav';

export const Heading: React.FC = () => {
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > screenSizes.lg) {
        showSlideOutMenuVar(false);
      } else {
        showSlideOutMenuVar(true);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Header>
      <div key="header-content" css={baphStyles.headerContent}>
        <LogoLink />
        {showSlideOutMenu ? (
          <SlideOutMenu>
            <MainNav />
          </SlideOutMenu>
        ) : (
          <MainNav />
        )}
      </div>
    </Header>
  );
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
  }
};
