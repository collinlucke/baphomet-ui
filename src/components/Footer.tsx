import { CSSObject } from '@emotion/react';

export const Footer: React.FC = () => {
  return (
    <footer css={baphStyles.footerStyles}>
      <div css={baphStyles.footerContentStyles}>
        <p>© {new Date().getFullYear()} Baphomet</p>
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://github.com/collinlucke"
            target="_blank"
            rel="noopener noreferrer"
          >
            Collin Lucke
          </a>
        </p>
      </div>
    </footer>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  footerStyles: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee'
  },
  footerContentStyles: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  }
};
