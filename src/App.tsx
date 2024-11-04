import './styling/index.css';
import { Outlet } from 'react-router-dom';
import { Heading } from './components/shared/Heading';
import { Main } from '@collinlucke/phantomartist';
// import { ErrorModal } from './components/shared/ErrorModal';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import { useLayoutEffect, useState } from 'react';
import { ShowHeadingContext } from './contexts';

// export const useShowNoHeading = () => useContext(ShowNoHeadingContext);

function App() {
  // const navigate = useNavigate();
  const [showHeading, setShowHeading] = useState(true);
  // const beenHereBefore = localStorage.getItem('beenHereBefore') === 'yup';

  // useLayoutEffect(() => {
  //   if (beenHereBefore) {
  //     navigate('movielist');
  //   }
  // }, [navigate, beenHereBefore]);

  return (
    <div>
      <ShowHeadingContext.Provider value={{ showHeading, setShowHeading }}>
        {!showHeading && <Heading />}
        <Main>
          <Outlet />
        </Main>
        {/* <ErrorModal /> */}
      </ShowHeadingContext.Provider>
    </div>
  );
}

export default App;
