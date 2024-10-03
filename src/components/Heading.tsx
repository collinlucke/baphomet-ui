import { HeaderMain, Button } from '@collinlucke/phantomartist';
import { useNavigate } from 'react-router-dom';

export const Heading: React.FC = () => {
  const navigate = useNavigate();
  const navToCreate = () => {
    navigate('/create');
  };

  const leftContent = <h1>Baphomet</h1>;
  const rightContent = <Button onClick={navToCreate}>Add new movie</Button>;
  return (
    <HeaderMain homeLinkContent={leftContent} rightContent={rightContent} />
  );
};
