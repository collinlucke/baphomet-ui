import { CSSObject } from '@emotion/react';
import { BodySection } from '../../components/BodySection';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import { useQuery } from '@apollo/client';
import { showFeedbackModalVar } from '../../reactiveVars';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { data } = useQuery(GET_MOVIES_BY_TITLE, {
    variables: {
      title: '',
      limit: 26,
      sortBy: 'winningPercentage',
      sortOrder: 'desc'
    },
    fetchPolicy: 'cache-and-network' // Use cache first, then network
  });

  const showFeedbackHandler = () => {
    showFeedbackModalVar(true);
  };

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
        <div css={baphStyles.feedback} onClick={showFeedbackHandler}>
          Any feedback is welcome!
        </div>
      </div>
      <div css={baphStyles.movieListContainer}>
        <MovieList
          movies={data?.movieResults?.searchResults}
          showSearch={false}
          className={{
            movieListWrapper: baphStyles.movieListWrapper,
            listWrapper: baphStyles.listWrapper
          }}
        />
      </div>
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
  movieListContainer: {
    position: 'relative'
  },
  movieListWrapper: {
    marginTop: '0'
  },
  listWrapper: {
    marginTop: '0'
  },
  feedback: {
    textDecoration: 'underline',
    fontSize: '1.2rem',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#007bff',
    fontWeight: 'bold',
    '&:hover': {
      color: '#0056b3'
    }
  }
};
