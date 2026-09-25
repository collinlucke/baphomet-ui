import { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Button, Main } from 'athameui';
import { useLocation, Link } from 'react-router-dom';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;

  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Main>
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <h2>Oops! Something went wrong</h2>
        <p>
          An error occurred on this page. Don't worry, the rest of the app
          should still work.
        </p>
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary>Error details (for developers)</summary>
          <pre
            style={{
              padding: '1rem',
              overflow: 'auto',
              fontSize: '0.8rem',
              marginTop: '0.5rem'
            }}
          >
            {error instanceof Error ? error.message : String(error)}
            {error instanceof Error ? error.stack : ''}
          </pre>
        </details>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={resetErrorBoundary} variant="secondary">
            Try Again
          </Button>
          <Button variant="ghost" dark>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </Main>
  );
};

export const ReactErrorBoundary = ({
  children,
  fallback
}: ErrorBoundaryProps) => {
  const location = useLocation();

  const handleError = (error: unknown, errorInfo: React.ErrorInfo) => {
    console.log('Error boundary caught:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      componentStack: errorInfo.componentStack
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
      resetKeys={[location.pathname]}
      onReset={() => {
        console.log('Error boundary reset');
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
