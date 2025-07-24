import { UIEvent } from 'react';
import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Main } from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from '@emotion/react';
import { baphTheme } from './styling/baphTheme';
import {
  errorVar,
  showHeadingVar,
  scrollLimitVar,
  cursorVar,
  searchTermVar,
  endOfResultsVar,
  getAllMoviesQueryVar
} from './reactiveVars';
import { useReactiveVar } from '@apollo/client';
import { CSSObject } from '@emotion/react';

export const App = () => {
  const showHeading = useReactiveVar(showHeadingVar);
  const error = useReactiveVar(errorVar);
  const limit = useReactiveVar(scrollLimitVar);
  const cursor = useReactiveVar(cursorVar);
  const searchTerm = useReactiveVar(searchTermVar);
  const endOfResults = useReactiveVar(endOfResultsVar);

  const onScrollHandler = (e: UIEvent<HTMLDivElement>) => {
    if (endOfResults) return;
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      const queryFunction = getAllMoviesQueryVar();
      if (!queryFunction) return;

      queryFunction({
        variables: {
          limit,
          searchTerm,
          cursor,
          loadAction: 'scroll',
          endOfResults
        }
      });
    }
  };

  return (
    <ThemeProvider theme={baphTheme}>
      <div
        className="baph-scroll-wrapper"
        onScroll={onScrollHandler}
        css={baphStyles.scrollDiv}
      >
        {showHeading && <Heading />}
        <Main>
          <Outlet />
        </Main>
        {error && <ErrorBoundary />}
      </div>
    </ThemeProvider>
  );
};

const baphStyles: CSSObject = {
  scrollDiv: {
    overflowX: 'hidden',
    height: '100vh',
    scrollbarWidth: 'thin'
  }
};

export default App;
