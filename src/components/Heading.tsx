import { PANavLink, HeaderMain } from '@collinlucke/phantomartist';

export const Heading: React.FC = () => {
  const leftContent = <h1>Baphomet</h1>;
  const rightContent = (
    <PANavLink style="primaryButton" to="/create">
      Add new movie
    </PANavLink>
  );
  return (
    <HeaderMain homeLinkContent={leftContent} rightContent={rightContent} />
  );
};
