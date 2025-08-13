import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { isMobileAndLandscapeVar } from '../reactiveVars';
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
  const isMobileAndLandscape = isMobileAndLandscapeVar();

  return (
    <Block
      className={{ block: baphStyles.sectionBlock }}
      dataTestId={`body-section-${pageSlug}`}
    >
      <section
        css={baphStyles.section}
        className={`section-wrapper${pageSlug ? `-${pageSlug}` : ''}`}
      >
        <InnerWidth
          size={innerWidthSize}
          className={{
            innerWidth: getSectionInnerWidthStyles(isMobileAndLandscape)
          }}
          dataTestid={`inner-width-${pageSlug}`}
        >
          <div css={baphStyles.sectionContent} className="section-content">
            {children}
          </div>
        </InnerWidth>
      </section>
    </Block>
  );
};

const getSectionInnerWidthStyles = (isMobileAndLandscape: boolean) => {
  return {
    ...baphStyles.sectionInnerWidth,
    padding: isMobileAndLandscape ? '0' : '0 1.5rem'
  };
};
const baphStyles: { [key: string]: CSSObject } = {
  sectionBlock: {
    marginBottom: '60px',
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
