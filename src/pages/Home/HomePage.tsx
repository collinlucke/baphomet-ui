import { CSSObject } from '@emotion/react';
import { AboveTheFold } from '../../components/AboveTheFold';

export const HomePage: React.FC = () => {
  return (
    <AboveTheFold>
      <div>
        <h1 css={baphStyles.welcomeTitle}>Welcome!</h1> You've just found your
        way to the most subjectively objective means of ranking movies ever.
        That... may not have made a lot of sense. Anyway, here you'll find a
        rather unique method of ranking movies. And hopefully you'll find it
        kinda fun. All you gotta do is just pick which one you like more.
      </div>

      <div>
        Now, full disclosure: this is a work in progress. Tweaks, changes, and
        improvements are constantly being made and a very small amount of
        features that are planned may not be implemented yet. Presently, you can
        create an account, log in with that account, add movies in the database,
        and log out.
      </div>
      <h2>Best Movies Ever!... So far.</h2>
    </AboveTheFold>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  welcomeTitle: {
    display: 'inline'
  }
};
