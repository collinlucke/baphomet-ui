import { CSSObject } from '@emotion/react';
import { isMobileAndLandscapeVar } from '../reactiveVars';

export const PageHeading: React.FC<{
  title: string;
  subtitle?: string;
  className?: CSSObject;
  slug?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}> = ({
  title,
  subtitle,
  className = {},
  slug,
  level = 1,
  ariaLabelledBy,
  ariaDescribedBy
}) => {
  const isMobileAndLandscape = isMobileAndLandscapeVar();
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const headingId = `heading-${slug || 'page'}`;

  return (
    <div
      css={`
        ${[
          getPageHeadingStyles(isMobileAndLandscape).pageHeading,
          className.pageHeading
        ]} page-heading-${slug}
      `}
      data-testid={`page-heading-${slug}`}
      role="banner"
      aria-labelledby={ariaLabelledBy || headingId}
      aria-describedby={subtitle ? `${headingId}-subtitle` : ariaDescribedBy}
    >
      <HeadingTag
        css={getPageHeadingStyles(isMobileAndLandscape, level).heading}
        id={headingId}
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <h4
          css={getPageHeadingStyles(isMobileAndLandscape, level).subtitle}
          id={`${headingId}-subtitle`}
          aria-label={`Subtitle: ${subtitle}`}
        >
          {subtitle}
        </h4>
      )}
    </div>
  );
};

const getPageHeadingStyles = (
  isMobileAndLandscape: boolean,
  level: number = 1
): CSSObject => {
  const getFontSize = (level: number) => {
    const sizes = {
      1: isMobileAndLandscape ? '1.5rem' : '2rem',
      2: isMobileAndLandscape ? '1.3rem' : '1.75rem',
      3: isMobileAndLandscape ? '1.2rem' : '1.5rem',
      4: isMobileAndLandscape ? '1.1rem' : '1.25rem',
      5: isMobileAndLandscape ? '1rem' : '1.1rem',
      6: isMobileAndLandscape ? '0.9rem' : '1rem'
    };
    return sizes[level as keyof typeof sizes] || sizes[1];
  };

  return {
    pageHeading: {
      marginBottom: '1rem'
    },
    heading: {
      fontSize: getFontSize(level),
      margin: 0,
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: isMobileAndLandscape ? '1rem' : '1.1rem',
      margin: '0.5rem 0 0 0',
      lineHeight: '1.3',
      color: '#6b7280',
      fontWeight: 'normal'
    }
  };
};
