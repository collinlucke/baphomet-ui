import { CSSObject } from '@emotion/react';
import { showFeedbackModalVar } from '../../reactiveVars';
import { baseColors, mediaQueries } from 'phantomartist';
import { Link } from 'react-router-dom';
import { Github01Icon } from 'hugeicons-react';

export const Footer: React.FC = () => {
  const handleFeedbackClick = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (
      e.type === 'click' ||
      (e as React.KeyboardEvent).key === 'Enter' ||
      (e as React.KeyboardEvent).key === ' '
    ) {
      showFeedbackModalVar(true);
    }
  };

  return (
    <footer css={baphStyles.footer} role="contentinfo" aria-label="Site footer">
      <div css={baphStyles.footerSection}>
        <div>© {new Date().getFullYear()} Baphomet</div>
        <div>
          <Link
            to="https://github.com/collinlucke"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Collin Lucke's GitHub profile"
          >
            <Github01Icon />
          </Link>
        </div>
      </div>

      <div css={baphStyles.footerSection}>
        Movie Data Provided by TMDb{' '}
        <Link
          to="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit The Movie Database (TMDb) website"
        >
          <img
            css={baphStyles.tmdbLogo}
            src="tmdb-logo-square.svg"
            alt="The Movie Database (TMDb) logo"
          />
        </Link>
      </div>

      <div css={baphStyles.footerSection}>
        <span
          css={baphStyles.feedbackLink}
          onClick={handleFeedbackClick}
          onKeyDown={handleFeedbackClick}
          role="button"
          tabIndex={0}
          aria-label="Send feedback about the application"
        >
          Send Feedback
        </span>
      </div>
    </footer>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  footer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    gap: '10px',
    [mediaQueries.minWidth.lg]: {
      flexDirection: 'row' as const,
      backgroundColor: baseColors.secondary[800],
      padding: '15px'
    }
  },
  footerSection: {
    flex: 1,
    color: baseColors.tertiary[100],
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
    fontSize: '.75rem',
    justifyContent: 'space-between',
    [mediaQueries.minWidth.md]: {
      fontSize: '0.875rem'
    }
  },
  feedbackLink: {
    width: '100%',
    textAlign: 'center' as const,
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    outline: 'none',
    borderRadius: '2px',
    '&:hover, &:focus': {
      color: '#0056b3',
      backgroundColor: 'rgba(0, 123, 255, 0.1)'
    },
    '&:focus': {
      outline: '2px solid #007bff',
      outlineOffset: '2px'
    }
  },
  tmdbLogo: {
    width: '32px',
    height: '32px',
    marginLeft: '10px'
  }
};
