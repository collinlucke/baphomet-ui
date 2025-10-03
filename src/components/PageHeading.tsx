import { mediaQueries } from 'phantomartist';
import { CSSObject } from '@emotion/react';

type PageHeadingProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: CSSObject;
  slug?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  rightContent?: React.ReactNode;
};

export const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  subtitle,
  className,
  slug,
  ariaLabelledBy,
  ariaDescribedBy,
  rightContent
}) => {
  const headingId = `heading-${slug || 'page'}`;

  return (
    <div
      data-testid={`page-heading-${slug}`}
      role="banner"
      aria-labelledby={ariaLabelledBy || headingId}
      aria-describedby={subtitle ? `${headingId}-subtitle` : ariaDescribedBy}
    >
      <div css={baphStyles.headingContainer}>
        <h1 css={[baphStyles.heading, className?.heading]} id={headingId}>
          <span>{title}</span>
        </h1>
        {rightContent}
      </div>
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
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: 0,
    lineHeight: '1.2',
    fontSize: '1.75rem',
    [mediaQueries.minWidth.md]: {
      fontSize: '2rem'
    }
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative' as const
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    lineHeight: '1.3',
    color: '#6b7280',
    fontWeight: 'normal'
  }
};
