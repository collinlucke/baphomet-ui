import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { isMobileVar, isLandscapeVar } from '../reactiveVars';
import { CSSObject } from '@emotion/react';

type BodySectionProps = {
  children: React.ReactNode;
  innerWidthSize?: 'full' | 'large' | 'medium' | 'small';
  pageSlug?: string;
};

export const BodySection: React.FC<BodySectionProps> = ({
  children,
  innerWidthSize,
  pageSlug = ''
}: BodySectionProps) => {
  const isMobile = isMobileVar();
  const isLandscape = isLandscapeVar();
  const isMobileAndLandscape = isMobile && isLandscape;
  console.log('isMobileAndLandscape', isMobileAndLandscape);

  return (
    <Block
      className={{ block: baphStyles.sectionBlock }}
      dataTestId={`body-section-${pageSlug}`}
    >
      <section
        css={getBodySectionStyles(isMobileAndLandscape).section}
        className={`section-wrapper${pageSlug ? `-${pageSlug}` : ''}`}
      >
        <InnerWidth
          size={innerWidthSize}
          className={{
            innerWidth: baphStyles.sectionInnerWidth
          }}
          dataTestid={`inner-width-${pageSlug}`}
        >
          <div
            css={getBodySectionStyles(isMobileAndLandscape).sectionContent}
            className="section-content"
          >
            {children}
          </div>
        </InnerWidth>
      </section>
    </Block>
  );
};

const getBodySectionStyles = (isMobileAndLandscape: boolean): CSSObject => {
  return {
    section: {
      ...baphStyles.section
    },
    sectionInnerWidth: {
      padding: isMobileAndLandscape ? '0' : '0 1.5rem',
      maxWidth: '1720px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '35px',
      marginTop: '1rem'
    },
    sectionContent: {
      ...baphStyles.sectionContent
    }
  };
};

const baphStyles: { [key: string]: CSSObject } = {
  sectionBlock: {
    // marginBottom: '60px'
    minHeight: '100vh'
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0 2rem'
  },
  sectionInnerWidth: {
    maxWidth: '1720px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '35px',
    marginTop: '1.5rem'
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  }
};
