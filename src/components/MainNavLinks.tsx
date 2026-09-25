import { ButtonGroup, tokens } from 'athameui';
import { MainNavLinkItem } from './MainNavLinkItem';
import { showSlideOutMenuVar, isSmallOrMobileVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

const mainNavPages = [
  { label: 'Arena ', to: '/arena' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'All Movies', to: '/all-movies' },
  { label: 'FAQ', to: '/faq' }
];

export const MainNavLinks = () => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const direction = isSmallOrMobile ? 'column' : 'row';
  const closeSlideOutMenu = () => {
    if (isSmallOrMobile) {
      showSlideOutMenuVar(false);
    }
  };

  return (
    <nav>
      <ButtonGroup
        direction={direction}
        sx={{ buttonGroup: baphStyles.buttonGroup }}
      >
        {mainNavPages.map(page => (
          <MainNavLinkItem
            key={page.label}
            label={page.label}
            to={page.to}
            onClick={closeSlideOutMenu}
          />
        ))}
      </ButtonGroup>
    </nav>
  );
};

const baphStyles = {
  buttonGroup: {
    gap: 0,
    [tokens.media.min.lg]: {
      gap: '5px'
    }
  }
};
