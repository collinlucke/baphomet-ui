import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div>
      <nav className="flex justify-between items-center mb6">
        <NavLink to="/">
          <h1>Baphomet</h1>
        </NavLink>
        <NavLink
          to="/create"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
        >
          Add Movie
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
