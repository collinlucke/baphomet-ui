import { NavLink } from 'react-router-dom';
import { Header, InnerWidth } from '@crazy-overlord/phantomartist';
import * as stylex from '@stylexjs/stylex';

// TODO: Replace with PhantomArtist
export const Heading: React.FC = () => {
  return (
    <Header className={baphStyles.header}>
      <InnerWidth>
        <NavLink to="/">
          <h1>Baphomet</h1>
        </NavLink>
      </InnerWidth>
    </Header>
  );
};

const baphStyles = stylex.create({
  header: {
    padding: '30px 0'
  }
});
