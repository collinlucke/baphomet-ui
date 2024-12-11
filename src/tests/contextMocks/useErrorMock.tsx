import { vi } from 'vitest';

const mockSetError = vi.fn();

const useError = () => {
  return {
    setError: mockSetError
  };
};

export { useError, mockSetError };
