import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/shared/Heading';
import { Main } from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { useState } from 'react';
import { ShowHeadingContext } from './contexts';
import { ErrorContext } from './contexts';
import { CustomErrorTypes } from './CustomTypes.types';

function App() {
  const [showHeading, setShowHeading] = useState(true);
  const [error, setError] = useState<CustomErrorTypes | undefined>(undefined);

  return (
    <div>
      <ShowHeadingContext.Provider value={{ showHeading, setShowHeading }}>
        <ErrorContext.Provider
          value={{
            error,
            setError: setError as (error: {} | undefined) => void
          }}
        >
          {showHeading && <Heading />}
          <Main>
            <Outlet />
          </Main>
          {error && <ErrorBoundary />}
        </ErrorContext.Provider>
      </ShowHeadingContext.Provider>
    </div>
  );
}

export default App;
