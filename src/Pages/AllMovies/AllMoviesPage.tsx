import { Block } from '@collinlucke/phantomartist';
import { MovieList } from '../../components/MovieList/MovieList';
import {
  baphSemanticColors,
  baphTypography,
  baphColors
} from '../../styling/baphTheme';
import { CSSObject } from '@emotion/react';

export const AllMoviesPage: React.FC = () => {
  return (
    <Block className={{ block: styles.container }} dataTestId="all-movies-page">
      <section css={styles.listSection}>
        <div css={styles.listContainer}>
          <p>
            <span css={styles.welcomeTitle}>Welcome!</span> Here's a big ol'
            list of movies.
          </p>
        </div>
        <MovieList
          movies={[]}
          totalMovieCount="0"
          onSearch={() => {}}
          setSearchTerm={() => {}}
          openDeleteModal={() => {}}
        />
      </section>
    </Block>
  );
};
const styles: { [key: string]: CSSObject } = {
  container: {
    flexDirection: 'column' as const,
    width: '100%',
    backgroundColor: baphSemanticColors.background.primary
  } as CSSObject,
  listSection: {
    position: 'relative' as const,
    padding: '2rem 2rem 4rem 2rem',
    height: 'calc(100vh - 75px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    background: baphColors.primary,
    width: '100%',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url("/back-to-the-future-backdrop.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'grayscale(100%)',
      opacity: 0.05,
      zIndex: 1
    },
    '& > *': {
      position: 'relative',
      zIndex: 2
    },
    '@media (max-width: 768px)': {
      padding: '2rem 1rem'
    }
  } as CSSObject,
  listContainer: {
    maxWidth: '1720px',
    width: '100%',
    color: baphColors.lightText,
    marginTop: '1rem'
  } as CSSObject,
  welcomeTitle: {
    ...baphTypography.styles.h1,
    color: baphColors.lightText,
    display: 'inline'
  } as CSSObject
};
