import * as stylex from '@stylexjs/stylex';
import { NavLink } from 'react-router-dom';
import { Header, InnerWidth } from '@crazy-overlord/phantomartist';

// TODO: Replace with PhantomArtist
export const Heading: React.FC = () => {
  return (
    <>
      <Header>
        <InnerWidth>
          <NavLink {...stylex.props(styles.link)} to="./">
            <h1>Baphomet</h1>
          </NavLink>
        </InnerWidth>
      </Header>
      <hr />
    </>
  );
};

const styles = {
  link: {
    color: 'black',
    textDecoration: 'none'
  }
};
