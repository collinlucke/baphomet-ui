/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { Main } from 'athameui';
import { MovieList } from '../../components/MovieList/MovieList';
import { LinkToFaq } from '../../components/LinkToFaq';
import { GET_ALL_MOVIES } from '../../api/queries';
import { useQuery } from '@apollo/client/react';
import { showFeedbackModalVar } from '../../reactiveVars';

type MovieResultsData = {
  movieResults: {
    searchResults: Array<{
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
    }>;
  };
};

const HomePage: React.FC = () => {
  const { data } = useQuery<MovieResultsData>(GET_ALL_MOVIES, {
    variables: {
      title: '',
      limit: 27,
      sortBy: 'winningPercentage',
      sortOrder: 'desc'
    },
    fetchPolicy: 'cache-and-network'
  });

  const showFeedbackHandler = () => {
    showFeedbackModalVar(true);
  };

  // const LinkToFaqClasses = cx(baphStyles.faqLink);
  console.log(baphStyles.faqLink);
  return (
    <Main>
      <div css={baphStyles.welcomeSection}>
        <h1 css={baphStyles.welcomeTitle}>Oh, Hey! It's you!</h1>
        <p>
          If you're here, it's pro'ly cuz I asked you to. So, thanks for showing
          up!
        </p>
        <p>
          As I might have explained, this is a movie ranking app. Over on the
          Arena page, you're going to be shown two movies. Vote for the one you
          think is the better movie - how you determine that is up to you. All
          the selections you make will be shaken and stirred with other users'
          selections and a score for each movie will be generated.
        </p>

        <p>
          So, when you are ready, click that "Sign Up" button in the header and
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
          className={{
            movieListWrapper: baphStyles.movieListWrapper,
            listWrapper: baphStyles.listWrapper
          }}
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
    width: 'fit-content',
    margin: '0 auto',
    '&:hover': {
      color: '#0056b3'
    }
  }
};
