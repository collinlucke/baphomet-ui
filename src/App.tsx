import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading.tsx';
import { Main } from '@crazy-overlord/phantomartist';
import './styling/styleX.css';

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
//changes
export default App;
