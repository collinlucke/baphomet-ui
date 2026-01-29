import type { CSSObject } from '@emotion/react';
import { Global } from '@emotion/react';

export const Globals = () => {
  return <Global styles={globalStyles} />;
};

const globalStyles: { [key: string]: CSSObject } = {
  body: {
    overflowX: 'hidden'
  }
};
