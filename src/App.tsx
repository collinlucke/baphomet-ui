import { Outlet } from 'react-router-dom';
import { Heading } from './components/shared/Heading.tsx';
import { Main } from '@collinlucke/phantomartist';
import './styling/index.css';
import { useLayoutEffect } from 'react';

function App() {
  const isWelcomePage = location.hash === '/';

  useLayoutEffect(() => {
    if (location.pathname !== '/') {
      location.hash = `#${location.pathname}`;
      location.pathname = '';
    }
  });

  return (
    <div>
      {!isWelcomePage && <Heading />}
      <Main>
        <Outlet />
      </Main>
    </div>
  );
}

export default App;
