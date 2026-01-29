import type { CSSObject } from '@emotion/react';
type MainProps = {
  children?: React.ReactNode;
};

export const Main = ({ children }: MainProps) => {
  return <main css={baphStyles.main}>{children}</main>;
};

const baphStyles: { [key: string]: CSSObject } = {
  main: {
    width: '100%',
    position: 'relative',
    padding: '32px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  }
};
