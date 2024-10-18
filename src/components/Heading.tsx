import {
  Header,
  Button,
  InnerWidth,
  Block,
  useResizedWidth
} from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const width = useResizedWidth();
  const navToCreate = () => {
    navigate('/create');
  };
  const buttonSize = () => {
    if (width <= 480) {
      return 'small';
    }
    if (width <= 580) {
      return 'medium';
    }
    return 'large';
  };

  return (
    <Header>
      <Block>
        <InnerWidth className={{ innerWidth: baphStyles.innerWidth }}>
          <h1>
            <Link to={'/'}>Baphomet</Link>
          </h1>
          <div>
            <Button size={buttonSize()} onClick={navToCreate}>
              Add new movie
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
  }
};
