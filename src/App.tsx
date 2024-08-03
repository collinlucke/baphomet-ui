import { Outlet } from 'react-router-dom';
import { Heading } from './components/Heading.tsx';
import { Main } from '@crazy-overlord/phantomartist';

// TODO: Make error handling and loading states better
function App() {
  return (
    <>
      <Heading />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
//changes
export default App;
