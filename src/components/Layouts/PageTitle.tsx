import type { CSSObject } from '@emotion/react';

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div css={baphStyles.title}>
      <h1>{title}</h1>
      {subtitle && <h2 css={baphStyles.subtitle}>{subtitle}</h2>}
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  title: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#666'
  }
};
