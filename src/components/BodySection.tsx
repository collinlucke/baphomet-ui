import { Block, InnerWidth, mediaQueries } from 'phantomartist';
import { CSSObject } from '@emotion/react';

type BodySectionProps = {
  children: React.ReactNode;
  innerWidthSize?: 'full' | 'large' | 'medium' | 'small';
  pageSlug?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
};

export const BodySection: React.FC<BodySectionProps> = ({
  children,
  innerWidthSize,
  pageSlug = '',
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  role
}: BodySectionProps) => {
  const sectionId = `body-section-${pageSlug}`;

  return (
    <Block
      className={{ block: baphStyles.sectionBlock }}
      dataTestId={sectionId}
    >
      <section
        css={baphStyles.section}
        className={`section-wrapper${pageSlug ? `-${pageSlug}` : ''}`}
        role={role}
        aria-label={
          ariaLabel ||
          `${pageSlug ? pageSlug.replace('-', ' ') : 'main'} content section`
        }
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        id={sectionId}
      >
        <InnerWidth
          size={innerWidthSize}
          className={{
            innerWidth: baphStyles.sectionInnerWidth
          }}
          dataTestid={`inner-width-${pageSlug}`}
        >
          <div
            css={baphStyles.sectionContent}
            className="section-content"
            role="region"
            aria-label="Content area"
          >
            {children}
          </div>
        </InnerWidth>
      </section>
    </Block>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  sectionBlock: {
    marginBottom: '60px',
    justifyContent: 'start'
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1rem 2rem',
    [mediaQueries.minWidth.xl]: {
      padding: '2rem'
    }
  },
  sectionInnerWidth: {
    maxWidth: '1720px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '35px',
    margin: '10px auto',
    [mediaQueries.minWidth.xl]: {
      margin: '1.5rem auto'
    }
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem'
  }
};
