import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup, Modal, Button } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { CustomErrorTypes } from '../../CustomTypes.types';

type ErrorModalTypes = {
  id?: string;
  children?: ReactNode;
  className?: {
    errorModal?: CSSObject;
  };
  error?: CustomErrorTypes;
  closeModal?: () => void;
};

export const ErrorModal: React.FC<ErrorModalTypes> = ({
  className,
  children,
  error
  // closeModal,
  // altErrorContent
}) => {
  const navigate = useNavigate();
  // switch (error?.status) {
  //   case '403':
  //     ErrorModalContent = <div>'have some text'</div>;
  //     break;
  //   default:
  //     'Glaring, judgemental stare';
  //     break;
  // }
  // console.log(ErrorModalContent);

  const goHomeHandler = () => {
    navigate('movielist');
  };

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <Modal
      className={{
        modal: { ...className?.errorModal, ...baseStyle.errorModal }
      }}
      // closeModal={closeModal}
    >
      {children ? (
        children
      ) : (
        <>
          <div>
            <h2>Error</h2>
            <p>
              <strong>Status:</strong>{' '}
              {error?.status !== undefined
                ? String(error?.status)
                : 'It dun broke.'}
            </p>
            <p>
              <strong>Message:</strong>{' '}
              {error?.status !== undefined
                ? String(error?.message)
                : `This isn't looking very good for you.`}
            </p>
          </div>

          <ButtonGroup>
            <Button onClick={goHomeHandler}>Go home</Button>
            <Button onClick={goBackHandler}>Go back</Button>
          </ButtonGroup>
        </>
      )}
    </Modal>
  );
};

const baseStyle = {
  errorModal: {
    // backgroundColor: 'transparent'
  }
};
