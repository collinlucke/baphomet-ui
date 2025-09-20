import { isAuthenticatedVar, showSlideOutMenuVar } from '../reactiveVars';

export const logout = () => {
  localStorage.removeItem('baphomet-token');
  localStorage.removeItem('baphomet-user');
  showSlideOutMenuVar(false);
  isAuthenticatedVar(false);
};
