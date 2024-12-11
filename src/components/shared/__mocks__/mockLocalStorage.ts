export const mockLocalStorage = () => {
  localStorage.clear();
  const mockLocalStorage: Record<string, unknown> = {};
  global.localStorage = {
    length: 0,
    key: (index: number) => {
      const keys = Object.keys(mockLocalStorage);
      return keys[index] || null;
    },
    setItem: (key, value) => {
      mockLocalStorage[key] = value;
    },
    getItem: key => {
      const value = mockLocalStorage[key];
      return typeof value === 'string' ? value : null;
    },
    removeItem: key => {
      delete mockLocalStorage[key];
    },
    clear: () => {
      for (let key in mockLocalStorage) {
        delete mockLocalStorage[key];
      }
    }
  };
  return () => {};
};
