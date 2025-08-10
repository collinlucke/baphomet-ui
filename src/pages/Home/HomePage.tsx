import { CSSObject } from '@emotion/react';
import { AboveTheFold } from '../../components/AboveTheFold';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import { useQuery } from '@apollo/client';
import { Button } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { data } = useQuery(GET_MOVIES_BY_TITLE, {
    variables: { title: '', limit: 21 }, // At full width, this will show 3 full rows of movies
    fetchPolicy: 'cache-and-network' // Use cache first, then network
  });

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
      <MovieList
        movies={data?.movieResults?.searchResults}
        showSearch={false}
        className={{
          movieListWrapper: baphStyles.movieListWrapper,
          listWrapper: baphStyles.listWrapper
        }}
      />
      <div>
        <h2>Well... What now?</h2>
        <p>
          If you want to see all the movies, click the button below. If you want
          to go to the arena and start ranking movies, click that button.
        </p>
        <div>
          <Link to="/all-movies">
            <Button
              kind="primary"
              size="large"
              className={{ button: baphStyles.button }}
            >
              View All Movies
            </Button>
          </Link>
        </div>
        <div></div>
        <Link to="/arena">
          <Button
            kind="secondary"
            size="large"
            className={{ button: baphStyles.button }}
          >
            Go to Arena
          </Button>
        </Link>
      </div>
    </AboveTheFold>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  welcomeTitle: {
    display: 'inline'
  },
  movieListWrapper: {
    marginTop: '0'
  },
  listWrapper: {
    marginTop: '0'
  },
  button: {
    marginTop: '20px',
    display: 'inline'
  }
};
