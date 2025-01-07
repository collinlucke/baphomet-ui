import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/shared/Heading';
import { Main } from '@collinlucke/phantomartist';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { errorVar, showHeadingVar } from './reactiveVars';
import { useReactiveVar } from '@apollo/client';

export const App = () => {
  const showHeading = useReactiveVar(showHeadingVar);
  const error = useReactiveVar(errorVar);

  return (
    <div>
      {showHeading && <Heading />}
      <Main>
        <Outlet />
      </Main>
      {error && <ErrorBoundary />}
    </div>
  );
};

export default App;
