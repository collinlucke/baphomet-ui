import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading.tsx';
import { Main } from '@collinlucke/phantomartist';
import './styling/index.css';

function App() {
  return (
    <div>
      <Heading />
      <Main>
        <Outlet />
      </Main>
    </div>
  );
}

export default App;
