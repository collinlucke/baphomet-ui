import { createContext, useContext } from 'react';

export const ShowHeadingContext = createContext<{
  showHeading: boolean;
  setShowHeading: (showHeading: boolean) => void;
}>({
  showHeading: false,
  setShowHeading: (showHeading: boolean) => {
    console.log(showHeading);
  }
});

export const useShowHeading = () => useContext(ShowHeadingContext);
