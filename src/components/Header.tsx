import React from 'react';
import { NavLink } from 'react-router-dom';

// TODO: Replace with PhantomArtist
const Navbar: React.FC = () => {
  return (
    <>
      <div>
        <NavLink to="./">
          <div>Baphomet</div>
        </NavLink>
      </div>
      <hr />
    </>
  );
};

export default Navbar;
