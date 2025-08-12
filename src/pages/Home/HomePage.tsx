import { CSSObject } from '@emotion/react';
import { BodySection } from '../../components/BodySection';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import { useQuery } from '@apollo/client';
// import { Button } from '@collinlucke/phantomartist';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { data } = useQuery(GET_MOVIES_BY_TITLE, {
    variables: { title: '', limit: 12 }, // At full width, this will show 3 full rows of movies
    fetchPolicy: 'cache-and-network' // Use cache first, then network
  });

  return (
    <BodySection>
      <div css={baphStyles.welcomeSection}>
        <h1 css={baphStyles.welcomeTitle}>Welcome!</h1> You've just found your
        way to the most subjectively objective means of ranking movies ever...
        That... doesn't make a whole lot of sense.
        <br />
        <br />
        <strong>TL:DR:</strong> This is a movie ranking app that uses a voting
        system to determine the best movies of all time.{' '}
        <Link to="/arena">We show you two movies at a time</Link>, you pick the
        one you like better, and hilarity ensues. <strong>[HINT]:</strong>{' '}
        You'll need to create an account first.
        <br />
        <br />
        <strong>Now, full disclosure:</strong> this is a work very much in
        progress. There's gonna be a lot of changes, a lot of bugs, a lot of
        weeping, wailing, and gnashing of teeth.
        <br />
        <br />
        <div css={baphStyles.feedback} onClick={() => {}}>
          Any feedback is welcome! Just text me... I haven't set up a feedback
          form yet.
        </div>
      </div>
      <div css={baphStyles.movieListContainer}>
        <MovieList
          sortBy="winningPercentage"
          movies={data?.movieResults?.searchResults}
          showSearch={false}
          className={{
            movieListWrapper: baphStyles.movieListWrapper,
            listWrapper: baphStyles.listWrapper
          }}
        />
      </div>
      {/* <div>
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
      </div> */}
    </BodySection>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  welcomeSection: {
    fontSize: '1rem',
    '& a': {
      textDecoration: 'underline'
    }
  },
  welcomeTitle: {
    display: 'inline',
    fontSize: '2rem'
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: '#1d4ed8',
    '&:hover': {
      color: '#1d4ed8',
      textDecoration: 'underline'
    },
    '&:visited': {
      color: 'inherit'
    }
  },
  movieListContainer: {
    position: 'relative',
    '&: before': {
      content: '"For Display Purposes Only"',
      position: 'absolute',
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      fontSize: '3rem',
      transform: 'rotate(-10deg)',
      zIndex: 1
    }
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
  },
  feedback: {
    textDecoration: 'underline',
    fontSize: '1.2rem',
    textAlign: 'center'
  }
};
