import { CSSObject } from '@emotion/react';
import { Main } from 'athameui';
import { MovieList } from '../../components/MovieList/MovieList';
import { LinkToFaq } from '../../components/LinkToFaq';
import { GET_ALL_MOVIES } from '../../api/queries';
import { useQuery } from '@apollo/client/react';
import { showFeedbackModalVar } from '../../reactiveVars';

type MovieResultsData = {
  movieResults: {
    searchResults: {
      id: string;
      title: string;
      releaseDate?: string;
      rated?: string;
      posterPath?: string;
      winningPercentage: number;
      overview?: string;
      genres?: string[];
      revenue?: number;
      backdropPath?: string;
      tmdbId: string;
    }[];
  };
};

const HomePage = () => {
  const { data } = useQuery<MovieResultsData>(GET_ALL_MOVIES, {
    variables: {
      title: '',
      limit: 36,
      sortBy: 'winningPercentage',
      sortOrder: 'desc'
    },
    fetchPolicy: 'cache-and-network'
  });

  const showFeedbackHandler = () => {
    showFeedbackModalVar(true);
  };

  return (
    <Main>
      <div css={baphStyles.welcomeSection}>
        <h1 css={baphStyles.welcomeTitle}>Oh, Hey! It's you!</h1>

        <p>
          If you're here, it's likely because we invited you directly. So,
          thanks for showing up!
        </p>

        <p>However you found your way here, welcome!</p>

        <p>
          So what we have here is a movie ranking app. If you were to mosey on
          over to the Arena page, you'd be shown two movies. Your job is simple:
          pick the one you think is better. And what does "better" mean? That's
          up to you. Whatever you want. I'm not a cop.
        </p>

        <p>
          From there, the system performs a little black magic behind the
          scenes, and POOF! Baphomet ranking score!
        </p>

        <p>
          So, when you are ready, click that "Sign Up" button up top there, and
          get to voting!
        </p>

        <LinkToFaq />
        <br />
        <div
          css={baphStyles.feedback}
          role="button"
          onClick={showFeedbackHandler}
        >
          And if you have any feedback, don't hesitate to reach out!
        </div>
      </div>
      <div css={baphStyles.movieListContainer}>
        <h3>Current Movie Standings...</h3>
        <br />
        <MovieList
          movies={data?.movieResults?.searchResults || null}
          showSearch={false}
        />
      </div>
    </Main>
  );
};

export default HomePage;

const baphStyles: { [key: string]: CSSObject } = {
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  welcomeTitle: {
    display: 'inline',
    fontSize: '2rem'
  },
  movieListContainer: {
    position: 'relative',
    width: '100%'
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
    width: 'fit-content',
    margin: '0 auto',
    '&:hover': {
      color: '#0056b3'
    }
  }
};
