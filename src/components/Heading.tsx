import { Header, Button, InnerWidth, Block } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const navToCreate = () => {
    navigate('/create');
  };

  const appTitle = <h1>Baphomet</h1>;
  const rightContent = <Button onClick={navToCreate}>Add new movie</Button>;
  return (
    <Header>
      <Block>
        <InnerWidth>
          <Link to="/">{appTitle}</Link>
          <div>{rightContent}</div>
        </InnerWidth>
      </Block>
    </Header>
  );
};
