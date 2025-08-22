import { useState } from 'react';
import { CSSObject } from '@emotion/react';
import { CircleArrowDown02Icon, CircleArrowUp02Icon } from 'hugeicons-react';
import { BodySection } from '../../components/BodySection';
import { baseVibrantColors } from '@collinlucke/phantomartist';
import { MovieList } from '../../components/MovieList/MovieList';
import { GET_MOVIES_BY_TITLE } from '../../api/queries';
import { useQuery } from '@apollo/client';
import { showFeedbackModalVar } from '../../reactiveVars';
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
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const showFeedbackHandler = () => {
    showFeedbackModalVar(true);
  };

  const showMoreInfoHandler = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <>
      <BodySection>
        <div css={baphStyles.welcomeSection}>
          <h1 css={baphStyles.welcomeTitle}>Oh, Hey! It's you!</h1>
          <p>
            If you're here, it's pro'ly cuz I asked you to. So, thanks for
            showing up!
          </p>
          <p>
            As I might have explained, this is a movie ranking app. Over on the
            Arena page, you're going to be shown two movies. Vote for the one
            you think is the better movie - how you determine that is up to you.
            All the selections you make will be shaken and stirred with other
            users' selections and a score for each movie will be generated.{' '}
          </p>

          <p>
            So, when you are ready, click that "Sign Up" button in the header
            and get to voting!
          </p>

          <div
            role="button"
            onClick={showMoreInfoHandler}
            css={baphStyles.showMoreInfo}
          >
            {showMoreInfo ? (
              <div>
                Less info if you're not interested{' '}
                <CircleArrowUp02Icon size={20} />
              </div>
            ) : (
              <div>
                More info if you're interested{' '}
                <CircleArrowDown02Icon size={20} />
              </div>
            )}
          </div>

          {showMoreInfo && (
            <>
              <p>
                A little word on how this pre-pre-alpha version works: There are
                currently 250 movies in the database to rank - the top 10
                highest grossing movies of each year from 2000-2024. Hopefully
                any y'all trying this out will have seen a good chunk of these.
                If you haven't seen one or both of the movies in an Arena
                matchup, there's a "Skip This Matchup" button to give you a new
                set of movies to duel over.
              </p>
              <p>
                Keep in mind this is very much a work in progress. There's gonna
                be a lot of changes, a lot of bugs, a lot of weeping, wailing,
                and gnashing of teeth.
              </p>
            </>
          )}
          <br />
          <div
            css={baphStyles.feedback}
            role="button"
            onClick={showFeedbackHandler}
          >
            If you have any feedback, don't hesitate to reach out!
          </div>
        </div>
        <div css={baphStyles.movieListContainer}>
          <h3>Current Movie Standings...</h3>
          <br />
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
    </>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  welcomeSection: {
    '& a': {
      textDecoration: 'underline'
    }
  },
  welcomeTitle: {
    display: 'inline',
    fontSize: '2rem'
  },
  showMoreInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem 0',
    textDecoration: 'underline',
    fontSize: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    color: baseVibrantColors.primary[700],
    '&:hover': {
      color: baseVibrantColors.primary[500]
    }
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
