import { Header, Button, InnerWidth, Block } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useScreenSize } from '../hooks/useScreenSize';
import { PlusSignIcon } from 'hugeicons-react';
import { isAuthenticatedVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const navToCreate = () => {
    navigate('/create');
  };

  const navToLogin = () => {
    navigate('/login');
  };

  const logOut = () => {
    localStorage.removeItem('baphomet-token');
    isAuthenticatedVar(false);
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
          {!isAuthenticated && (
            <Button
              onClick={navToLogin}
              className={{ button: baphStyles.logInLogOut }}
              kind="ghost"
            >
              Log in
            </Button>
          )}
          {isAuthenticated && (
            <div css={{ display: 'flex' }}>
              <Button
                kind="ghost"
                className={{ button: baphStyles.logInLogOut }}
                onClick={logOut}
              >
                Log out
              </Button>
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
          )}
        </InnerWidth>
      </Block>
    </Header>
  );
};

const baphStyles = {
  innerWidth: {
    flexDirection: 'row' as const,
    alignItems: 'end'
  },
  button: {
    position: 'relative' as const,
    marginLeft: '20px'
  },
  logInLogOut: {
    fontSize: '1.2em'
  }
};
