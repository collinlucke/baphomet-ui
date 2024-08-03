import { NavLink } from 'react-router-dom';
import { Header, InnerWidth } from '@crazy-overlord/phantomartist';

// TODO: Replace with PhantomArtist
export const Heading: React.FC = () => {
  return (
    <>
      <Header>
        <InnerWidth>
          <NavLink to="/">
            <h1>Baphomet</h1>
          </NavLink>
        </InnerWidth>
      </Header>
      <hr />
    </>
  );
};
