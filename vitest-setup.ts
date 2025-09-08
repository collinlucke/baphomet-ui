import '@testing-library/jest-dom/vitest';
import '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});
