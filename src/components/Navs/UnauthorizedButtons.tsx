import { Button, ButtonGroup } from '@collinlucke/phantomartist';
import {
  showLoginModalVar,
  showSignUpModalVar,
  isSmallOrMobileVar
} from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

export const UnauthorizedButtons = () => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const buttonSize = isSmallOrMobile ? 'medium' : 'small';

  const showLoginModalHandler = () => {
    showLoginModalVar(true);
  };

  const showSignUpModalHandler = () => {
    showSignUpModalVar(true);
  };

  return (
    <ButtonGroup
      direction={isSmallOrMobile ? 'vertical' : 'horizontal'}
      className={{ buttonGroup: getButtonGroupStyles(isSmallOrMobile) }}
    >
      <Button
        onClick={showSignUpModalHandler}
        variant="secondary"
        size={buttonSize}
        ariaLabel="Open sign up form"
        ariaDescribedBy="signup-help"
        testId="signup-button"
        className={{ button: baphStyles.noWrapButton }}
      >
        Sign Up
      </Button>
      <Button
        onClick={showLoginModalHandler}
        variant={isSmallOrMobile ? 'outline' : 'primary'}
        size={buttonSize}
        ariaLabel="Open log in form"
        ariaDescribedBy="login-help"
        testId="login-button"
        className={{ button: baphStyles.noWrapButton }}
      >
        Log in
      </Button>
      <span id="signup-help" css={baphStyles.srOnly}>
        Create a new account to add and rate movies
      </span>
      <span id="login-help" css={baphStyles.srOnly}>
        Sign in to your existing account
      </span>
    </ButtonGroup>
  );
};

const getButtonGroupStyles = (isSmallOrMobile: boolean) => ({
  alignItems: 'start' as const,
  ...(isSmallOrMobile ? { marginTop: '20px' } : {})
});

const baphStyles = {
  buttonGroup: {
    alignItems: 'start' as const
  },
  noWrapButton: {
    whiteSpace: 'nowrap' as const
  },
  srOnly: {
    visibility: 'hidden' as const,
    position: 'absolute' as const
  }
};
