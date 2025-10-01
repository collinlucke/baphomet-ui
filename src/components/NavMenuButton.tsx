import { Link } from 'react-router-dom';
import { Button } from 'phantomartist';
import { useReactiveVar } from '@apollo/client/react';
import { isSmallOrMobileVar } from '../reactiveVars';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'ghostOnDark'
  | 'outline'
  | undefined;

type NavMenuButtonProps = {
  children: React.ReactElement | string;
  to?: string;
  onDark?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  variant?: ButtonVariant;
  testId?: string;
  onClick?: () => void;
};

export const NavMenuButton = ({
  children,
  to,
  onDark = true,
  ariaLabel,
  ariaDescribedBy,
  variant,
  testId,
  onClick
}: NavMenuButtonProps) => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const buttonSize = isSmallOrMobile ? 'medium' : 'small';
  let buttonVariant: ButtonVariant;

  if (variant) {
    buttonVariant = variant;
  } else if (isSmallOrMobile || onDark) {
    buttonVariant = 'ghostOnDark';
  } else {
    buttonVariant = 'ghost';
  }

  const ButtonElement = () => (
    <Button
      size={buttonSize}
      variant={buttonVariant}
      className={{ button: baphStyles.button }}
      onClick={onClick}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      testId={testId}
    >
      {children}
    </Button>
  );

  return (
    <>
      {!to ? (
        <ButtonElement />
      ) : (
        <Link to={to}>
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
