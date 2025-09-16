import { vi } from 'vitest';
export const setupIntersectionObserverMock = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.IntersectionObserverEntry = vi.fn();

  return mockIntersectionObserver;
};

export const setupThemeMock = () => {
  vi.mock('../../styling/baphTheme', () => ({
    baphColorVariations: {
      tertiary: { 50: '#ffffff' }
    }
  }));
};
