import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading.tsx';
import { Main } from '@collinlucke/phantomartist';
import './styling/index.css';

function App() {
  const isWelcomePage = location.hash === '';

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
