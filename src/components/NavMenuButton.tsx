import { Link } from 'react-router-dom';
import { Button } from 'athameui';
import { useReactiveVar } from '@apollo/client/react';
import { isSmallOrMobileVar } from '../reactiveVars';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'outline'
  | undefined;

type NavMenuButtonProps = {
  children?: string | React.ReactNode;
  to?: string;
  dark?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  variant?: ButtonVariant;
  testId?: string;
  onClick?: () => void;
};

export const NavMenuButton = ({
  children,
  to,
  ariaLabel,
  ariaDescribedBy,
  variant = 'ghost',
  testId,
  onClick
}: NavMenuButtonProps) => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);

  const ButtonElement = () => (
    <Button
      size="full"
      variant={variant}
      sx={{ button: baphStyles.button }}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      dark={isSmallOrMobile}
      textPosition={isSmallOrMobile ? 'left' : 'center'}
    >
      {children}
    </Button>
  );

  return (
    <>
      {!to ? (
        <ButtonElement />
      ) : (
        <Link to={to} style={{ width: '100%' }}>
          <ButtonElement />
        </Link>
      )}
    </>
  );
};

const baphStyles = {
  button: {
    padding: '10px 0',
    whiteSpace: 'nowrap' as const,
    '&:hover': {
      boxShadow: 'none'
    }
  }
};
