import { CSSObject } from '@emotion/react';
import { Footer as AthFooter, Button } from 'athameui';
import { showFeedbackModalVar } from '../../reactiveVars';
import { tokens } from 'athameui';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Github01Icon } from '@hugeicons/core-free-icons';

const { color, media } = tokens;

export const Footer = () => {
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
    <AthFooter>
      <div css={baphStyles.footerSection}>
        <div>© {new Date().getFullYear()} Baphomet</div>
        <div>
          <Link
            to="https://github.com/collinlucke/baphomet-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Collin Lucke's GitHub profile"
          >
            <HugeiconsIcon icon={Github01Icon} size={20} />
          </Link>
        </div>
      </div>

      <div css={[baphStyles.footerSection, { justifyContent: 'center' }]}>
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

      <div css={[baphStyles.footerSection, { justifyContent: 'flex-end' }]}>
        <Button variant="ghost" size="small" onClick={handleFeedbackClick} dark>
          Send Feedback
        </Button>
      </div>
    </AthFooter>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  footerSection: {
    flex: 1,
    color: color.tertiary[100],
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
    fontSize: '.75rem',
    gap: '1rem',
    [media.min.md]: {
      fontSize: '0.875rem'
    }
  },
  feedbackLink: {
    width: '100%',
    textAlign: 'center' as const,
    color: color.primary[500],
    cursor: 'pointer',
    textDecoration: 'underline',
    outline: 'none',
    borderRadius: '2px',
    '&:hover, &:focus': {
      color: color.primary[700],
      backgroundColor: 'rgba(0, 123, 255, 0.1)'
    },
    '&:focus': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '2px'
    }
  },
  tmdbLogo: {
    width: '32px',
    height: '32px',
    marginLeft: '10px'
  }
};
