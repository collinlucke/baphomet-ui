import { Button, ButtonGroup, tokens } from 'athameui';
import {
  showLoginModalVar,
  showSignUpModalVar,
  isSmallOrMobileVar,
  showSlideOutMenuVar
} from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

export const UnauthorizedButtons = () => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);
  const showSlideOutMenu = useReactiveVar(showSlideOutMenuVar);

  const showLoginModalHandler = () => {
    showLoginModalVar(true);
  };

  const showSignUpModalHandler = () => {
    showSignUpModalVar(true);
  };

  return (
    <ButtonGroup sx={{ buttonGroup: getButtonGroupStyles(isSmallOrMobile) }}>
      <Button
        onClick={showSignUpModalHandler}
        variant="tertiary"
        size="small"
        aria-label="Open sign up form"
        aria-describedby="signup-help"
        testId="signup-button"
        dark={showSlideOutMenu}
      >
        Sign Up
      </Button>
      <Button
        onClick={showLoginModalHandler}
        variant={isSmallOrMobile ? 'outline' : 'primary'}
        size="small"
        aria-label="Open log in form"
        aria-describedby="login-help"
        testId="login-button"
        dark
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
  gap: '10px',
  [tokens.media.min.lg]: {
    gap: '15px'
  },
  ...(isSmallOrMobile ? { marginTop: '20px' } : {})
});

const baphStyles = {
  noWrapButton: {
    whiteSpace: 'nowrap' as const
  },
  srOnly: {
    visibility: 'hidden' as const,
    position: 'absolute' as const
  }
};
