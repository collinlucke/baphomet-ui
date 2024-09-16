import { Header, PANavLink } from '@collinlucke/phantomartist';

export const Heading: React.FC = () => {
  return (
    <Header useInnerWidth isHeading>
      <PANavLink to="/">
        <h1>Baphomet</h1>
      </PANavLink>
    </Header>
  );
};
