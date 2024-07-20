import React from 'react';
import { NavLink } from 'react-router-dom';

// TODO: Replace with PhantomArtist
const Navbar: React.FC = () => {
  return (
    <>
      <div className="h-32 flex items-center p-5">
        <NavLink to="./">
          <div className="text-5xl">Baphomet</div>
        </NavLink>
      </div>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 w-full" />
    </>
  );
};

export default Navbar;
