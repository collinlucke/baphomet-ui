import { Header, Button, InnerWidth, Block } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useScreenSize } from '../../hooks/useScreenSize';
import { PlusSignIcon } from 'hugeicons-react';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const navToCreate = () => {
    navigate('/create');
  };

  return (
    <Header dataTestId="main-page-heading">
      <Block>
        <InnerWidth className={{ innerWidth: baphStyles.innerWidth }}>
          <h1>
            <Link to={'/'} data-testid="home-link">
              Baphomet
            </Link>
          </h1>
          <div>
            <Button
              dataTestId="add-new-movie-button"
              size={screenSize}
              onClick={navToCreate}
              icon={
                <PlusSignIcon
                  size={screenSize === 'small' ? 20 : 17}
                  strokeWidth={'3px'}
                />
              }
              iconOnly={screenSize === 'small'}
              className={{ button: baphStyles.button }}
            >
              {screenSize === 'small' ? '' : <>Add new movie</>}
            </Button>
          </div>
        </InnerWidth>
      </Block>
    </Header>
  );
};

const baphStyles = {
  innerWidth: {
    flexDirection: 'row' as 'row',
    alignItems: 'end'
  },
  button: {
    position: 'relative' as 'relative'
  }
};
