import React, { useState } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_RANDOM_MATCHUP } from '../../api/queries';
import { SUBMIT_VOTE } from '../../api/mutations';
import { BodySection } from '../../components/BodySection';
import { PageHeading } from '../../components/PageHeading';
import { MovieCard } from '../../components/MovieCard';
import {
  Button,
  baseColors,
  baseVibrantColors,
  mediaQueries
} from '@collinlucke/phantomartist';
import { isMobileAndLandscapeVar } from '../../reactiveVars';
import { CSSObject } from '@emotion/react';

type Movie = {
  id: string;
  title: string;
  posterUrl?: string;
  releaseDate?: string;
  genres?: string[];
  winningPercentage?: number;
  totalWins?: number;
  totalLosses?: number;
  totalComparisons?: number;
};

type Matchup = {
  movie1: Movie;
  movie2: Movie;
  comparisonId: string;
};

export const ArenaPage: React.FC = () => {
  const isMobileAndLandscape = useReactiveVar(isMobileAndLandscapeVar);
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_RANDOM_MATCHUP, {
    errorPolicy: 'all'
  });

  const [submitVote] = useMutation(SUBMIT_VOTE, {
    onCompleted: data => {
      setIsVoting(false);
      setVoteResult({
        success: data.submitVote.success,
        message: data.submitVote.message
      });

      setVoteResult(null);
      refetch();
    },
    onError: error => {
      setIsVoting(false);
      setVoteResult({
        success: false,
        message: error.message
      });
      setTimeout(() => setVoteResult(null), 3000);
    }
  });

  const handleVote = async (winnerId: string) => {
    if (!data?.getRandomMovieMatchup || isVoting) return;

    setIsVoting(true);
    const matchup: Matchup = data.getRandomMovieMatchup;

    try {
      await submitVote({
        variables: {
          movie1Id: matchup.movie1.id,
          movie2Id: matchup.movie2.id,
          winnerId: winnerId
        }
      });
    } catch (err) {
      console.error('Vote submission error:', err);
    }
  };

  const handleSkip = () => {
    console.log(loading ? 'Skipping matchup...' : 'Refetching matchup...');
    refetch();
  };

  const ArenaContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <BodySection pageSlug="arena">
        <PageHeading
          title="Movie Arena"
          slug="arena"
          className={arenaStyles.pageHeading}
        />
        <div css={arenaStyles.container} className="arena-container">
          {children}
        </div>
      </BodySection>
    );
  };

  if (loading) {
    console.log('Loading matchup...');
    return (
      <ArenaContainer>
        <div css={arenaStyles.loadingContainer}>
          <p css={arenaStyles.loadingText}>Loading next matchup...</p>
        </div>
      </ArenaContainer>
    );
  }

  if (error) {
    return (
      <ArenaContainer>
        <div css={arenaStyles.errorContainer}>
          <p css={arenaStyles.errorText}>
            {error.message.includes('Not enough movies')
              ? 'Not enough movies available for matchups. Add more movies to get started!'
              : 'Failed to load matchup. Please try again.'}
          </p>
          <Button kind="primary" size="medium" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </ArenaContainer>
    );
  }

  if (!data?.getRandomMovieMatchup) {
    return (
      <ArenaContainer>
        <div css={arenaStyles.errorContainer}>
          <p css={arenaStyles.errorText}>No matchup available</p>
          <Button kind="primary" size="medium" onClick={() => refetch()}>
            Get Matchup
          </Button>
        </div>
      </ArenaContainer>
    );
  }

  const matchup: Matchup = data.getRandomMovieMatchup;

  const getMatchupContainerStyles: () => CSSObject = () => {
    return {
      ...arenaStyles.matchupContainer,
      flexDirection: isMobileAndLandscape ? 'row' : 'column'
    };
  };

  return (
    <ArenaContainer>
      {/* <div>Which bear is best?</div> */}

      {voteResult && (
        <div
          css={[
            arenaStyles.voteResult,
            voteResult.success ? arenaStyles.voteSuccess : arenaStyles.voteError
          ]}
        >
          {voteResult.message}
        </div>
      )}

      <div
        css={getMatchupContainerStyles()}
        className="arena-matchup-container"
      >
        {/* Movie 1 */}

        <MovieCard
          movie={matchup.movie1}
          isVoting={isVoting}
          handleVote={handleVote}
        />

        {/* VS Divider */}
        <div css={arenaStyles.vsAndSkipContainer}>
          <div css={arenaStyles.vsContainer}>
            <div css={arenaStyles.vsText}>VS</div>
          </div>
          <div css={arenaStyles.actionButtons}>
            <Button
              kind="outline"
              size="medium"
              onClick={handleSkip}
              disabled={isVoting}
            >
              Skip This Matchup
            </Button>
          </div>
        </div>

        {/* Movie 2 */}

        <MovieCard
          movie={matchup.movie2}
          isVoting={isVoting}
          handleVote={handleVote}
        />
      </div>

      {/* <div css={arenaStyles.actionButtons}>
        <Button
          kind="outline"
          size="medium"
          onClick={handleSkip}
          disabled={isVoting}
        >
          Skip This Matchup
        </Button>
      </div> */}
    </ArenaContainer>
  );
};

const arenaStyles: { [key: string]: CSSObject } = {
  vsAndSkipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem',
    marginTop: '1rem'
  },
  container: {
    display: 'flex',
    alignItems: 'start',
    gap: '2rem',
    minHeight: '80vh',
    justifyContent: 'center',
    [mediaQueries.maxWidth.lg]: {
      alignItems: 'center'
    }
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: baseVibrantColors.primary[300],
    textAlign: 'center',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    [mediaQueries.maxWidth.md]: {
      fontSize: '2.5rem'
    }
  },
  subtitle: {
    textAlign: 'center',
    color: baseColors.tertiary[200],
    fontSize: '1.2rem',
    margin: 0
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px'
  },
  loadingText: {
    color: baseColors.tertiary[300],
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: baseColors.secondary[700],
    borderRadius: '8px',
    border: `1px solid ${baseVibrantColors.accent[500]}`
  },
  errorText: {
    color: baseVibrantColors.accent[300],
    textAlign: 'center',
    margin: 0,
    fontSize: '1.1rem'
  },
  voteResult: {
    padding: '1rem 2rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  },
  voteSuccess: {
    backgroundColor: baseVibrantColors.secondary[700],
    color: baseVibrantColors.secondary[300],
    border: `1px solid ${baseVibrantColors.secondary[500]}`
  },
  voteError: {
    backgroundColor: baseVibrantColors.accent[700],
    color: baseVibrantColors.accent[300],
    border: `1px solid ${baseVibrantColors.accent[500]}`
  },
  matchupContainer: {
    display: 'flex',
    gap: '3rem',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1200px',
    width: '100%',
    flexDirection: 'column',
    [mediaQueries.minWidth.sm]: {
      flexDirection: 'row',
      gap: '2rem'
    }
  },
  movieContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    maxWidth: '400px'
  },
  vsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  vsText: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: baseVibrantColors.primary[300],
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    padding: '1rem',
    backgroundColor: baseColors.secondary[700],
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${baseVibrantColors.primary[500]}`
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    zIndex: 10
  }
};
