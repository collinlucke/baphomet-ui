import React from 'react';
import { NavLink } from 'react-router-dom';

// TODO: Replace with PhantomArtist
const Navbar: React.FC = () => {
  return (
    <>
      <div>
        <NavLink to="./">
          <h1>Baphomet</h1>
        </NavLink>
      </div>
      <hr />
    </>
  );
};

export default Navbar;
