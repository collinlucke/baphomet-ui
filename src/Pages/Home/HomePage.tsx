import { Button, Block } from '@collinlucke/phantomartist';
import { useNavigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { isAuthenticatedVar } from '../../reactiveVars';
import {
  baphColors,
  baphColorVariations,
  baphSemanticColors,
  baphTypography
} from '../../styling/baphTheme';
import { CSSObject } from '@emotion/react';
import {
  Search01Icon,
  PlusSignIcon,
  UserIcon,
  Delete02Icon
} from 'hugeicons-react';

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
    <Block className={{ block: styles.container }} dataTestId="home-page">
      {/* Hero Section */}
      <section css={styles.heroSection}>
        <div css={styles.heroContainer}>
          <span css={styles.welcomeTitle}>Welcome!</span> You've just found your
          way to the most subjectively objective means of ranking movies ever.
          That... may not have made a lot of sense. Anyway, here you'll find a
          rather unique method of ranking movies. And hopefully you'll find it
          kinda fun. All you gotta do is just pick which one you like more.
        </div>
        <div css={styles.heroTextContent}>
          <span css={baphTypography.styles.h1}>
            Best Movies Ever!... So far.
          </span>
        </div>
        {/* <div css={styles.heroContent}>
          <div css={styles.logoContainer}>
            <img
              src="baphy-full-transparent.png"
              alt="Baphomet mascot"
              css={styles.heroLogo}
            />
          </div>
          <div css={styles.heroText}>
            <h1 css={styles.heroTitle}>Welcome to Baphomet</h1>
            <p css={styles.heroSubtitle}>
              Your personal movie database and rating system
            </p>
            <p css={styles.heroDescription}>
              Discover, rate, and manage your favorite films in one beautifully
              crafted interface.
            </p>
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section css={styles.featuresSection}>
        <div css={styles.featuresContainer}>
          <h2 css={styles.sectionTitle}>What You Can Do</h2>
          <div css={styles.featuresGrid}>
            <div css={styles.featureCard}>
              <div css={styles.featureIcon}>
                <Search01Icon size={32} color={baphColors.secondary} />
              </div>
              <h3 css={styles.featureTitle}>Browse Movies</h3>
              <p css={styles.featureDescription}>
                Explore our curated collection of films with detailed
                information and ratings.
              </p>
              <Button
                onClick={navigateToMovies}
                className={{ button: styles.featureButton }}
                kind="primary"
              >
                View Collection
              </Button>
            </div>

            {isAuthenticated && (
              <div css={styles.featureCard}>
                <div css={styles.featureIcon}>
                  <PlusSignIcon size={32} color={baphColors.secondary} />
                </div>
                <h3 css={styles.featureTitle}>Add Movies</h3>
                <p css={styles.featureDescription}>
                  Contribute to the database by adding your favorite films and
                  reviews.
                </p>
                <Button
                  onClick={navigateToCreate}
                  className={{ button: styles.featureButton }}
                  kind="primary"
                >
                  Add Movie
                </Button>
              </div>
            )}

            <div css={styles.featureCard}>
              <div css={styles.featureIcon}>
                <Delete02Icon size={32} color={baphColors.secondary} />
              </div>
              <h3 css={styles.featureTitle}>Movie Arena</h3>
              <p css={styles.featureDescription}>
                Compare and compete! See how movies stack up against each other.
              </p>
              <Button
                onClick={navigateToArena}
                className={{ button: styles.featureButton }}
                kind="primary"
              >
                Enter Arena
              </Button>
            </div>

            {!isAuthenticated && (
              <div css={styles.featureCard}>
                <div css={styles.featureIcon}>
                  <UserIcon size={32} color={baphColors.secondary} />
                </div>
                <h3 css={styles.featureTitle}>Join the Community</h3>
                <p css={styles.featureDescription}>
                  Log in to unlock full features including adding movies and
                  personal ratings.
                </p>
                <Button
                  onClick={navigateToLogin}
                  className={{ button: styles.featureButton }}
                  kind="primary"
                >
                  Log In
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section css={styles.ctaSection}>
        <div css={styles.ctaContainer}>
          <h2 css={styles.ctaTitle}>Ready to Dive In?</h2>
          <p css={styles.ctaDescription}>
            Start exploring our movie collection and discover your next favorite
            film.
          </p>
          <Button
            onClick={navigateToMovies}
            className={{ button: styles.ctaButton }}
            kind="secondary"
            size="large"
          >
            Browse Movies
          </Button>
        </div>
      </section>
    </Block>
  );
};

const styles = {
  container: {
    flexDirection: 'column' as const,
    minHeight: '100vh',
    width: '100%',
    backgroundColor: baphSemanticColors.background.primary
  },

  featuresContainer: {
    flexDirection: 'column' as const,
    alignItems: 'center',
    maxWidth: '1720px',
    margin: '0 auto',
    width: '100%'
  },

  ctaContainer: {
    flexDirection: 'column' as const,
    alignItems: 'center',
    maxWidth: '1720px',
    margin: '0 auto',
    width: '100%'
  },

  featureButton: {
    width: '100%'
  },

  ctaButton: {
    ...baphTypography.styles.button,
    padding: '1rem 2rem'
  },

  heroSection: {
    position: 'relative' as const,
    padding: '2rem 2rem 4rem 2rem', // Reduced top padding from 4rem to 2rem
    height: 'calc(100vh - 75px)', // Subtract header height (75px) from viewport height
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start', // Align to top instead of center
    justifyContent: 'flex-start',
    background: `linear-gradient(135deg, ${baphColors.primary} 0%, ${baphColorVariations.primary[400]} 100%)`,
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
      padding: '2rem 1rem' // Reduce padding on mobile
    }
  } as CSSObject,

  heroContainer: {
    maxWidth: '1720px',
    width: '100%',
    color: baphColors.lightText,
    fontSize: baphTypography.fontSize.lg,
    lineHeight: baphTypography.lineHeight.relaxed,
    marginTop: '1rem' // Reduced from 2rem to 1rem
  } as CSSObject,

  heroTextContent: {
    maxWidth: '1720px',
    width: '100%',
    color: baphColors.lightText,
    fontSize: baphTypography.fontSize.lg,
    lineHeight: baphTypography.lineHeight.relaxed,
    marginTop: '1rem' // Reduced from 2rem to 1rem
  } as CSSObject,

  welcomeTitle: {
    ...baphTypography.styles.h1,
    color: baphColors.lightText,
    display: 'inline'
  } as CSSObject,

  heroContent: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '1200px',
    width: '100%',
    gap: '3rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      textAlign: 'center'
    }
  } as CSSObject,

  logoContainer: {
    flex: '0 0 auto'
  } as CSSObject,

  heroLogo: {
    width: '300px',
    height: 'auto',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
    '@media (max-width: 768px)': {
      width: '200px'
    }
  } as CSSObject,

  heroText: {
    flex: 1,
    color: baphSemanticColors.text.onDark
  } as CSSObject,

  heroTitle: {
    ...baphTypography.styles.hero,
    margin: '0 0 1rem 0',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    '@media (max-width: 768px)': {
      fontSize: baphTypography.fontSize['4xl']
    }
  } as CSSObject,

  heroSubtitle: {
    ...baphTypography.styles.subtitle,
    margin: '0 0 1rem 0',
    opacity: 0.9,
    '@media (max-width: 768px)': {
      fontSize: baphTypography.fontSize.lg
    }
  } as CSSObject,

  heroDescription: {
    ...baphTypography.styles.bodyLarge,
    margin: 0,
    opacity: 0.8
  } as CSSObject,

  featuresSection: {
    padding: '4rem 2rem',
    backgroundColor: baphSemanticColors.background.secondary,
    width: '100%'
  } as CSSObject,

  sectionTitle: {
    ...baphTypography.styles.h2,
    color: baphSemanticColors.text.primary,
    marginBottom: '3rem',
    textAlign: 'center'
  } as CSSObject,

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%'
  } as CSSObject,

  featureCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: `1px solid ${baphSemanticColors.border.light}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      borderColor: baphColors.secondary
    }
  } as CSSObject,

  featureIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: baphColorVariations.secondary[100],
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto'
  } as CSSObject,

  featureTitle: {
    ...baphTypography.styles.h4,
    color: baphSemanticColors.text.primary,
    margin: '0 0 1rem 0'
  } as CSSObject,

  featureDescription: {
    ...baphTypography.styles.body,
    color: baphSemanticColors.text.secondary,
    margin: '0 0 2rem 0'
  } as CSSObject,

  ctaSection: {
    padding: '4rem 2rem',
    backgroundColor: baphColors.primary,
    textAlign: 'center',
    width: '100%'
  } as CSSObject,

  ctaTitle: {
    ...baphTypography.styles.h2,
    color: baphSemanticColors.text.onDark,
    margin: '0 0 1rem 0'
  } as CSSObject,

  ctaDescription: {
    ...baphTypography.styles.bodyLarge,
    color: baphSemanticColors.text.onDark,
    margin: '0 0 2rem 0',
    opacity: 0.9
  } as CSSObject
};
