import { CSSObject } from '@emotion/react';
import { isMobileAndLandscapeVar } from '../reactiveVars';

export const PageHeading: React.FC<{
  title: string;
  subtitle?: string;
  className?: CSSObject;
  slug?: string;
}> = ({ title, subtitle, className = {}, slug }) => {
  const isMobileAndLandscape = isMobileAndLandscapeVar();
  return (
    <div
      css={`
        ${[
          getPageHeadingStyles(isMobileAndLandscape).pageHeading,
          className.pageHeading
        ]} page-heading-${slug}
      `}
      data-testid={`page-heading-${slug}`}
    >
      <h1 css={getPageHeadingStyles(isMobileAndLandscape).h1}>{title}</h1>
      {subtitle && (
        <h4 css={getPageHeadingStyles(isMobileAndLandscape).h4}>{subtitle}</h4>
      )}
    </div>
  );
};

const getPageHeadingStyles = (isMobileAndLandscape: boolean): CSSObject => {
  return {
    pageHeading: {
      marginBottom: '1rem'
    },
    h1: {
      fontSize: isMobileAndLandscape ? '1.5rem' : '2rem',
      margin: 0,
      lineHeight: '1.2'
    }
  };
};
