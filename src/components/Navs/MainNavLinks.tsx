import { ButtonGroup } from 'phantomartist';
import { NavMenuButton } from '../Buttons/NavMenuButton';
import { showSlideOutMenuVar, isSmallOrMobileVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

const mainNavPages = [
  { label: 'Arena ', to: '/arena' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'All Movies', to: '/all-movies' },
  { label: 'FAQ', to: '/faq' }
];

export const MainNavLinks = () => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);

  const closeSlideOutMenu = () => {
    if (isSmallOrMobile) {
      showSlideOutMenuVar(false);
    }
  };

  return (
    <ButtonGroup
      className={{
        buttonGroup: getNavButtonGroupStyles(isSmallOrMobile)
      }}
      direction={isSmallOrMobile ? 'vertical' : 'horizontal'}
    >
      {mainNavPages.map(page => (
        <NavMenuButton
          key={page.label}
          to={page.to}
          onClick={closeSlideOutMenu}
          ariaLabel={`Go to ${page.label} page`}
        >
          {page.label}
        </NavMenuButton>
      ))}
    </ButtonGroup>
  );
};

const getNavButtonGroupStyles = (isSmallOrMobile: boolean) => ({
  ...(isSmallOrMobile
    ? {
        flexDirection: 'column' as const,
        alignItems: 'flex-start' as const
      }
    : {
        flexDirection: 'row' as const,
        alignItems: 'center' as const
      })
});
