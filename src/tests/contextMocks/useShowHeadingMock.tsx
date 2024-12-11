import { vi } from 'vitest';

const mockSetShowHeading = vi.fn();

const useShowHeading = () => ({
  setShowHeading: mockSetShowHeading
});

export { useShowHeading, mockSetShowHeading };
