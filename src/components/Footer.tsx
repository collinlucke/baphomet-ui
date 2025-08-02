import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer css={footerStyles}>
      <div css={footerContentStyles}>
        <p>© {new Date().getFullYear()} Baphomet</p>
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your Name
          </a>
        </p>
      </div>
    </footer>
  );
};

const footerStyles = {
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #eee'
};

const footerContentStyles = {
  maxWidth: '1200px',
  margin: '0 auto',
  textAlign: 'center'
};
