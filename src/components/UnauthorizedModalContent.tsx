import { ModalContent } from './ModalContent';
import { Button } from '@collinlucke/phantomartist';

export const UnauthorizedModalContent: React.FC = () => {
  return (
    <ModalContent
      title="You are not authorized to view this content"
      subtitle="Please log in to access this page."
    >
      <div css={baphStyles.unauthorizedModalActions}>
        <Button onClick={() => {}} variant="primary">
          Log In
        </Button>
        <Button onClick={() => {}} variant="secondary">
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
