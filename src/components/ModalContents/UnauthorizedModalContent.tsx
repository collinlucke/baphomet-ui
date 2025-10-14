import { ModalContent } from './ModalContent';
import { Button } from 'phantomartist';
import {
  showLoginModalVar,
  showUnauthorizedModalVar
} from '../../reactiveVars';

export const UnauthorizedModalContent = () => {
  const onLoginClickHandler = () => {
    showUnauthorizedModalVar(false);
    showLoginModalVar(true);
  };

  const onCancelClickHandler = () => {
    showUnauthorizedModalVar(false);
  };

  return (
    <ModalContent
      title="You are not authorized to view this content"
      subtitle="Please log in to access this page."
    >
      <div css={baphStyles.unauthorizedModalActions}>
        <Button onClick={onLoginClickHandler} variant="primary">
          Log In
        </Button>
        <Button onClick={onCancelClickHandler} variant="secondary">
          Cancel
        </Button>
      </div>
    </ModalContent>
  );
};

const baphStyles = {
  unauthorizedModalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  }
};
