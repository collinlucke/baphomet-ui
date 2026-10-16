import { font, media } from 'athameui';
import { Link } from 'react-router-dom';
import { showSlideOutMenuVar, isMobileVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

export const LogoLink = () => {
  const isMobile = useReactiveVar(isMobileVar);
  const closeSlideOutMenu = () => {
    showSlideOutMenuVar(false);
  };
  return (
    <Link
      to={'/'}
      data-testid="logo-link"
      css={baphStyles.logoLink}
      aria-label="Baphomet - Go to homepage"
      onClick={isMobile ? closeSlideOutMenu : undefined}
    >
      <h1 css={getTitleStyles(isMobile)}>Baphy</h1>
      <img
        src="/baphy-favicon.png"
        alt="Baphomet logo"
        css={baphStyles.logo}
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
        fontSize: font.size.lg
      }
    : {
        fontSize: font.size['2xl']
      })
});

const baphStyles = {
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none'
  },
  logo: {
    width: '44px',
    height: '44px',
    objectFit: 'contain' as const,
    [media.max.lg]: {
      width: '56px',
      height: '56px'
    }
  }
};
