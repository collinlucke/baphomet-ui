import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading.tsx';
import { Main } from '@crazy-overlord/phantomartist';
import './styling/styleX.css';

const base_url =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_BASE_URL
    : process.env.SERVER_BASE_UR;

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
