import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';

type AboveTheFoldProps = {
  children: React.ReactNode;
  innerWidthSize?: 'full' | 'large' | 'medium' | 'small';
  pageSlug?: string;
};

export const AboveTheFold: React.FC<AboveTheFoldProps> = ({
  children,
  innerWidthSize,
  pageSlug = 'above-the-fold'
}: AboveTheFoldProps) => {
  return (
    <Block className={{ block: baphStyles.container }} dataTestId={pageSlug}>
      <section css={baphStyles.aboveTheFoldSection} className="">
        <InnerWidth
          size={innerWidthSize}
          className={{ innerWidth: baphStyles.aboveTheFoldContainer }}
        >
          <div css={baphStyles.aboveTheFoldContainer}>{children}</div>
        </InnerWidth>
      </section>
    </Block>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  container: {
    flexDirection: 'column' as const,
    width: '100%',
    marginBottom: '60px'
  },
  aboveTheFoldSection: {
    // padding: '2rem',
    minHeight: 'calc(100vh - 75px)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0 36px',
    '& > *': {
      position: 'relative',
      zIndex: 2
    }
  },
  aboveTheFoldContainer: {
    maxWidth: '1720px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '35px',
    marginTop: '1rem'
  }
};
