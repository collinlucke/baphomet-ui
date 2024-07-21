import { Outlet } from 'react-router-dom';
import Header from './components/Header.tsx';
import './styles.css';
import './App.css';

// TODO: Make error handling and loading states better
function App() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
//changes
export default App;
