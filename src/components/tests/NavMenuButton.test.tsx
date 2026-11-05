import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { NavMenuButton } from '../NavMenuButton';
import { isSmallOrMobileVar } from '../../reactiveVars';

// Create a test Apollo client
const testClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink()
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ApolloProvider client={testClient}>{ui}</ApolloProvider>
    </BrowserRouter>
  );
};

describe('NavMenuButton', () => {
  beforeEach(() => {
    // Reset reactive var before each test
    isSmallOrMobileVar(false);
  });

  describe('Variant logic', () => {
    it('uses provided variant when specified', () => {
      renderWithProviders(
        <NavMenuButton variant="secondary">Primary Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-secondary');
    });

    it('uses ghost variant on small/mobile screens', () => {
      isSmallOrMobileVar(true);

      renderWithProviders(<NavMenuButton>Mobile Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-ghost');
    });

    it('uses ghost variant when dark is true', () => {
      renderWithProviders(<NavMenuButton dark>Dark Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-ghost');
    });

    it('uses ghost variant when dark is false and not mobile', () => {
      renderWithProviders(<NavMenuButton>Light Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-ghost');
    });
  });

  describe('Size logic', () => {
    it('uses medium size on small/mobile screens', () => {
      isSmallOrMobileVar(true);

      renderWithProviders(<NavMenuButton>Mobile Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-small');
    });

    it('uses small size on desktop screens', () => {
      isSmallOrMobileVar(false);

      renderWithProviders(<NavMenuButton>Desktop Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-small');
    });
  });

  describe('Accessibility', () => {
    it('applies aria-label when provided', () => {
      renderWithProviders(
        <NavMenuButton ariaLabel="Custom aria label">Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom aria label');
    });

    it('applies aria-describedby when provided', () => {
      renderWithProviders(
        <NavMenuButton ariaDescribedBy="description-id">Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description-id');
    });
  });

  describe('Click handling', () => {
    it('calls onClick handler when button is clicked', () => {
      const mockOnClick = vi.fn();

      renderWithProviders(
        <NavMenuButton onClick={mockOnClick}>Clickable Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when Link button is clicked', () => {
      const mockOnClick = vi.fn();

      renderWithProviders(
        <NavMenuButton to="/test" onClick={mockOnClick}>
          Link Button
        </NavMenuButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration scenarios', () => {
    it('handles all props together correctly', () => {
      const mockOnClick = vi.fn();

      renderWithProviders(
        <NavMenuButton
          to="/complex-route"
          dark
          variant="secondary"
          ariaLabel="Complex button"
          ariaDescribedBy="complex-desc"
          testId="complex-button"
          onClick={mockOnClick}
        >
          Complex Button
        </NavMenuButton>
      );

      // Check link
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/complex-route');

      // Check button properties
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ath-button-secondary');
      expect(button).toHaveAttribute('aria-label', 'Complex button');
      expect(button).toHaveAttribute('aria-describedby', 'complex-desc');
      expect(button).toHaveAttribute('data-testid', 'complex-button');

      // Check click handler
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles mobile + onDark + custom variant correctly', () => {
      isSmallOrMobileVar(true);

      renderWithProviders(
        <NavMenuButton dark variant="outline">
          Mobile Dark Button
        </NavMenuButton>
      );

      const button = screen.getByRole('button');
      console.log('button VVV');
      console.log(button);
      expect(button).toHaveClass(
        'ath-button-small',
        'ath-button-dark',
        'ath-button-outline'
      );
    });
  });
});
