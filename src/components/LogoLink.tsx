import { mediaQueries } from 'phantomartist';
import { Link } from 'react-router-dom';
import { showSlideOutMenuVar, isMobileVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

export const LogoLink = () => {
  const isMobile = useReactiveVar(isMobileVar);
  const closeSlideOutMenu = () => {
    showSlideOutMenuVar(false);
  };
  return (
    <Link
      to={'/'}
      data-testid="home-link"
      css={baphStyles.logoLink}
      aria-label="Baphomet - Go to homepage"
      onClick={isMobile ? closeSlideOutMenu : undefined}
    >
      <h1 css={getTitleStyles(isMobile)}>Baphomet</h1>
      <img
        src="/baphy-favicon.png"
        alt="Baphomet logo"
        css={baphStyles.favicon}
        role="presentation"
        aria-hidden="true"
      />
    </Link>
  );
};

const getTitleStyles = (isMobile: boolean) => ({
  margin: 0,
  ...(isMobile
    ? {
        fontSize: '1.5rem'
      }
    : {
        fontSize: '1.6rem',
        [mediaQueries.minWidth.md]: {
          fontSize: '1.6rem'
        },
        [mediaQueries.minWidth.lg]: {
          fontSize: '2rem'
        }
      })
});

const baphStyles = {
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    [mediaQueries.minWidth.sm]: {
      gap: '8px'
    },
    [mediaQueries.minWidth.md]: {
      gap: '10px'
    },
    [mediaQueries.minWidth.lg]: {
      gap: '12px'
    }
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    [mediaQueries.minWidth.md]: {
      fontSize: '1.6rem'
    },
    [mediaQueries.minWidth.lg]: {
      fontSize: '2rem'
    }
  },
  favicon: {
    width: '40px',
    height: '40px',
    objectFit: 'contain' as const,
    [mediaQueries.minWidth.md]: {
      width: '48px',
      height: '48px'
    },
    [mediaQueries.minWidth.lg]: {
      width: isMobileVar() ? '52px' : '64px',
      height: isMobileVar() ? '52px' : '64px'
    }
  }
};
