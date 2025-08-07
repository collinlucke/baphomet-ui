import { useRef, UIEvent } from 'react';
import { Block, InnerWidth } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';

type AboveTheFoldProps = {
  children: React.ReactNode;
  innerWidthSize?: 'full' | 'large' | 'medium' | 'small';
  pageSlug?: string;
  fetchMoreResults?: () => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};

export const AboveTheFold: React.FC<AboveTheFoldProps> = ({
  children,
  innerWidthSize,
  pageSlug = 'above-the-fold',
  fetchMoreResults,
  onScroll
}: AboveTheFoldProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScrollHandler = (e: UIEvent<HTMLDivElement>) => {
    console.log(e);
    console.log('Scroll event triggered');
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 150;

    if (nearBottom) {
      console.log('Near bottom, fetching more movies');
      onScroll?.();
    }
  };

  return (
    <Block className={{ block: baphStyles.container }} dataTestId={pageSlug}>
      <section
        // css={baphStyles.aboveTheFoldSection}
        onScroll={onScrollHandler}
        ref={scrollRef}
        css={{ ...baphStyles.scrollWrapper, ...baphStyles.aboveTheFoldSection }}
        className="new-baph-scroll-wrapper"
      >
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
  },
  innerWidth: {},
  scrollWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    marginTop: '35px',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    height: '100vh',
    overScrollBehavior: 'contain'
  }
};
