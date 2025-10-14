import { CSSObject } from '@emotion/react';
import { Button } from 'phantomartist';
import { ArrowUp01Icon } from 'hugeicons-react';

export const ScrollToTopButton = () => {
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div css={baphStyles.scrollToTop}>
      <Button
        className={{ button: baphStyles.button }}
        variant="secondary"
        onClick={handleScroll}
      >
        <ArrowUp01Icon />
      </Button>
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  scrollToTop: {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
  },
  button: {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
