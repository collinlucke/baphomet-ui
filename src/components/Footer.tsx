import { CSSObject } from '@emotion/react';
import { showFeedbackModalVar } from '../reactiveVars';
import { baseColors } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';

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
    <footer
      css={baphStyles.footerStyles}
      role="contentinfo"
      aria-label="Site footer"
    >
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
        <p>
          © {new Date().getFullYear()} Baphomet Made with ❤️ by{' '}
          <a
            href="https://github.com/collinlucke"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Collin Lucke's GitHub profile"
          >
            Collin Lucke
          </a>
          {' • '}
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
        </p>
      </div>
    </footer>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  footerStyles: {
    padding: '15px',
    backgroundColor: baseColors.secondary[800],
    display: 'flex'
  },
  footerContentStyles: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  },
  footerSection: {
    flex: 1,
    color: baseColors.tertiary[100],
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'end'
  },
  feedbackLink: {
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
    verticalAlign: 'middle',
    marginLeft: '10px'
  }
};
