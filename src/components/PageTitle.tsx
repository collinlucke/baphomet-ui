import { CSSObject } from '@emotion/react';

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div css={baphStyles.pageTitle}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  pageTitle: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  }
};
