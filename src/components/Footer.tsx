import { CSSObject } from '@emotion/react';
import { showFeedbackModalVar } from '../reactiveVars';
import { baseColors } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer css={baphStyles.footerStyles}>
      <div css={baphStyles.footerSection}>
        Movie Data Provided by TMDb{' '}
        <Link
          to="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            css={baphStyles.tmdbLogo}
            src="tmdb-logo-square.svg"
            alt="TMDb Logo"
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
          >
            Collin Lucke
          </a>
          {' • '}
          <span
            css={baphStyles.feedbackLink}
            onClick={() => showFeedbackModalVar(true)}
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
    '&:hover': {
      color: '#0056b3'
    }
  },
  tmdbLogo: {
    width: '32px',
    height: '32px',
    verticalAlign: 'middle',
    marginLeft: '10px'
  }
};
