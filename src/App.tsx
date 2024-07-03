import { Outlet } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.js';
import './App.css';

function App() {
  return (
    <div className="w-full p6">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
