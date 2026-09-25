import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { NavMenuButton } from '../../NavMenuButton';
import { isSmallOrMobileVar } from '../../../reactiveVars';

// Create a test Apollo client
const testClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink()
});

jest.mock('phantomartist', () => ({
  Button: ({
    children,
    size,
    variant,
    className,
    onClick,
    ariaLabel,
    ariaDescribedBy,
    testId
  }: {
    children: React.ReactNode;
    size: string;
    variant: string;
    className?: { button?: unknown };
    onClick?: () => void;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    testId?: string;
  }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      data-size={size}
      data-variant={variant}
      className={className?.button ? 'custom-button-class' : ''}
    >
      {children}
    </button>
  )
}));

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

  describe('Basic rendering', () => {
    it('renders with text children', () => {
      renderWithProviders(<NavMenuButton>Test Button</NavMenuButton>);
      expect(
        screen.getByRole('button', { name: 'Test Button' })
      ).toBeInTheDocument();
    });

    it('renders with React element children', () => {
      renderWithProviders(
        <NavMenuButton>
          <span>Icon Button</span>
        </NavMenuButton>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Icon Button')).toBeInTheDocument();
    });

    it('applies custom testId', () => {
      renderWithProviders(
        <NavMenuButton testId="custom-nav-button">Test</NavMenuButton>
      );
      expect(screen.getByTestId('custom-nav-button')).toBeInTheDocument();
    });
  });

  describe('Link behavior', () => {
    it('renders as a Link when "to" prop is provided', () => {
      renderWithProviders(
        <NavMenuButton to="/test-route">Link Button</NavMenuButton>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test-route');

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders as a standalone button when "to" prop is not provided', () => {
      renderWithProviders(<NavMenuButton>Standalone Button</NavMenuButton>);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Variant logic', () => {
    it('uses provided variant when specified', () => {
      renderWithProviders(
        <NavMenuButton variant="primary">Primary Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('uses ghost variant on small/mobile screens', () => {
      isSmallOrMobileVar(true);

      renderWithProviders(<NavMenuButton>Mobile Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('uses ghost variant when dark is true', () => {
      renderWithProviders(<NavMenuButton dark>Dark Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('uses ghost variant when dark is false and not mobile', () => {
      renderWithProviders(<NavMenuButton>Light Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });
  });

  describe('Size logic', () => {
    it('uses medium size on small/mobile screens', () => {
      isSmallOrMobileVar(true);

      renderWithProviders(<NavMenuButton>Mobile Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'medium');
    });

    it('uses small size on desktop screens', () => {
      isSmallOrMobileVar(false);

      renderWithProviders(<NavMenuButton>Desktop Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'small');
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
      const mockOnClick = jest.fn();

      renderWithProviders(
        <NavMenuButton onClick={mockOnClick}>Clickable Button</NavMenuButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when Link button is clicked', () => {
      const mockOnClick = jest.fn();

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

  describe('Styling', () => {
    it('applies custom button styles', () => {
      renderWithProviders(<NavMenuButton>Styled Button</NavMenuButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button-class');
    });
  });

  describe('Integration scenarios', () => {
    it('handles all props together correctly', () => {
      const mockOnClick = jest.fn();

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
      expect(button).toHaveAttribute('data-variant', 'secondary');
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
      expect(button).toHaveAttribute('data-size', 'medium'); // mobile size
      expect(button).toHaveAttribute('data-variant', 'outline'); // custom variant overrides
    });
  });
});
