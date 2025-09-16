import React from 'react';
import { vi } from 'vitest';

export const createPhantomArtistMock = () => ({
  List: vi.fn(
    ({
      children,
      ordered
    }: {
      children: React.ReactNode[];
      [key: string]: unknown;
    }) => {
      const ListElement = ordered ? 'ol' : 'ul';

      return <ListElement>{children}</ListElement>;
    }
  ),

  Search: vi.fn(
    ({
      searchTerm = '',
      setSearchTerm,
      searchLabel = 'Search',
      totalResultsCount = '0',
      showSearchButton = true,
      showResultsCount = true,
      buttonText = 'Search',
      label,
      autoFocus = false,
      testId = 'search-component',
      resultsAriaLive = 'polite'
    }: {
      searchTerm?: string;
      setSearchTerm?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      searchLabel?: string;
      totalResultsCount?: string;
      showSearchButton?: boolean;
      showResultsCount?: boolean;
      buttonText?: string;
      label?: string;
      autoFocus?: boolean;
      testId?: string;
      resultsAriaLive?: 'polite' | 'assertive' | 'off';
    }) => {
      return (
        <div data-testid={testId} role="search" aria-label="Search">
          {showResultsCount && (
            <div
              data-testid="total-results"
              aria-live={resultsAriaLive}
              role="status"
            >
              Total Results: {totalResultsCount}
            </div>
          )}

          <input
            data-testid="search-input"
            type="search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={searchLabel}
            autoFocus={autoFocus}
            aria-label={label || searchLabel}
          />

          {showSearchButton && (
            <button
              data-testid="search-submit-button"
              type="button"
              aria-label={`${buttonText} - ${totalResultsCount} results available`}
            >
              {buttonText}
            </button>
          )}
        </div>
      );
    }
  ),

  Modal: ({
    isOpen,
    children,
    title,
    onClose
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    title: string;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,

  baseColors: {
    primary: {
      700: '#4A1512'
    },
    tertiary: { 50: '#ffffff' }
  },

  baseVibrantColors: {
    primary: {
      500: '#7B2D26',
      600: '#5A1E1A'
    },
    secondary: {
      500: '#2D5A87'
    },
    accent: {
      500: '#D4AF37'
    }
  },

  mediaQueries: {
    minWidth: {
      md: '@media (min-width: 768px)',
      lg: '@media (min-width: 1024px)',
      xl: '@media (min-width: 1280px)'
    }
  }
});
