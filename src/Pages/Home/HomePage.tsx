import { Button, Block, InnerWidth } from '@collinlucke/phantomartist';
import { useNavigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { isAuthenticatedVar } from '../../reactiveVars';
// import {
//   baphColors,
//   baphColorVariations,
//   baphSemanticColors,
//   baphTypography
// } from '../../styling/baphTheme';
import { CSSObject } from '@emotion/react';

const backgroundImage = '/back-to-the-future-backdrop.jpg';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  const navigateToMovies = () => {
    navigate('/movielist');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToCreate = () => {
    navigate('/create');
  };

  const navigateToArena = () => {
    navigate('/arena');
  };

  return (
    <Block className={{ block: baphStyles.container }} dataTestId="home-page">
      <section css={baphStyles.aboveTheFoldSection}>
        <InnerWidth size="full">
          <div css={baphStyles.aboveTheFoldContainer}>
            <div>
              <h1 css={baphStyles.welcomeTitle}>Welcome!</h1> You've just found
              your way to the most subjectively objective means of ranking
              movies ever. That... may not have made a lot of sense. Anyway,
              here you'll find a rather unique method of ranking movies. And
              hopefully you'll find it kinda fun. All you gotta do is just pick
              which one you like more.
            </div>

            <div>
              Now, full disclosure: this is a work in progress. Tweaks, changes,
              and improvements are constantly being made, and a very small
              amount of features that are planned, may not be implemented yet.
              Presently, you can create an account, log in with that account,
              and log out.
            </div>
            <h2>Best Movies Ever!... So far.</h2>
          </div>
          <div></div>
        </InnerWidth>
      </section>
    </Block>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  container: {
    flexDirection: 'column' as const,
    width: '100%'
  },
  aboveTheFoldSection: {
    padding: '2rem 0', // Reduced top padding from 4rem to 2rem
    minHeight: 'calc(100vh - 75px)', // Subtract header height (75px) from viewport height
    display: 'flex',
    flexDirection: 'column' as const,
    '& > *': {
      position: 'relative',
      zIndex: 2
    }
  },
  aboveTheFoldContainer: {
    maxWidth: '1720px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '35px',
    marginTop: '1rem'
  },
  welcomeTitle: {
    display: 'inline'
  }
};
