import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.tsx';
import './App.css';
// import '../../phantomartist/dist/style.css';
// TODO: Make error handling and loading states better
function App() {
  return (
    <div className="w-full bg-blue-400">
      <Header />
      <Outlet />
    </div>
  );
}
//changes
export default App;
