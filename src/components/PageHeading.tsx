import { mediaQueries } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';

export const PageHeading: React.FC<{
  title: string;
  subtitle?: string;
  className?: CSSObject;
  slug?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}> = ({
  title,
  subtitle,
  className,
  slug,
  ariaLabelledBy,
  ariaDescribedBy
}) => {
  const headingId = `heading-${slug || 'page'}`;

  return (
    <div
      data-testid={`page-heading-${slug}`}
      role="banner"
      aria-labelledby={ariaLabelledBy || headingId}
      aria-describedby={subtitle ? `${headingId}-subtitle` : ariaDescribedBy}
    >
      <h1 css={[baphStyles.heading, className?.heading]} id={headingId}>
        {title}
      </h1>
      {subtitle && (
        <h4
          css={[baphStyles.subtitle, className?.subtitle]}
          aria-label={`Subtitle: ${subtitle}`}
        >
          {subtitle}
        </h4>
      )}
    </div>
  );
};

const baphStyles = {
  heading: {
    margin: 0,
    lineHeight: '1.2',
    fontSize: '1.75rem',
    [mediaQueries.minWidth.md]: {
      fontSize: '2rem'
    }
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    lineHeight: '1.3',
    color: '#6b7280',
    fontWeight: 'normal'
  }
};
