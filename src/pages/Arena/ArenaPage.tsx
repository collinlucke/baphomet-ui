import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
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
} from 'phantomartist';
import { CSSObject } from '@emotion/react';
import {
  isLargeScreenVar,
  isMobileAndLandscapeVar
} from '../../reactiveVars.ts';
import { useReactiveVar } from '@apollo/client/react';

type Movie = {
  id: string;
  title: string;
  posterPath?: string;
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

interface MatchupData {
  getRandomMovieMatchup: Matchup;
}

interface SubmitVoteData {
  submitVote: {
    success: boolean;
    message: string;
  };
}

export const ArenaPage: React.FC = () => {
  const isLargeScreen = useReactiveVar(isLargeScreenVar);
  const isMobileAndLandscape = useReactiveVar(isMobileAndLandscapeVar);
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { data, loading, error, refetch } = useQuery<MatchupData>(
    GET_RANDOM_MATCHUP,
    {
      errorPolicy: 'all'
    }
  );

  const [submitVote, { data: voteData, error: voteError }] =
    useMutation<SubmitVoteData>(SUBMIT_VOTE);

  useEffect(() => {
    if (voteData?.submitVote) {
      setIsVoting(false);
      setVoteResult({
        success: voteData.submitVote.success,
        message: voteData.submitVote.message
      });

      setVoteResult(null);
      refetch();
    }
  }, [voteData, refetch]);

  useEffect(() => {
    if (voteError) {
      setIsVoting(false);
      setVoteResult({
        success: false,
        message: voteError.message
      });
      setTimeout(() => setVoteResult(null), 3000);
    }
  }, [voteError]);

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
    refetch();
  };

  const ArenaContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <BodySection pageSlug="arena">
        <PageHeading
          title="Movie Arena"
          slug="arena"
          className={baphStyles.pageHeading}
        />
        <div css={baphStyles.container} className="arena-container">
          {children}
        </div>
      </BodySection>
    );
  };

  if (loading) {
    return (
      <ArenaContainer>
        <div css={baphStyles.loadingContainer}>
          <p css={baphStyles.loadingText}>Loading next matchup...</p>
        </div>
      </ArenaContainer>
    );
  }

  if (error) {
    return (
      <ArenaContainer>
        <div css={baphStyles.errorContainer}>
          <p css={baphStyles.errorText}>
            {error.message.includes('Not enough movies')
              ? 'Not enough movies available for matchups. Add more movies to get started!'
              : 'Failed to load matchup. Please try again.'}
          </p>
          <Button variant="primary" size="medium" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </ArenaContainer>
    );
  }

  if (!data?.getRandomMovieMatchup) {
    return (
      <ArenaContainer>
        <div css={baphStyles.errorContainer}>
          <p css={baphStyles.errorText}>No matchup available</p>
          <Button variant="primary" size="medium" onClick={() => refetch()}>
            Get Matchup
          </Button>
        </div>
      </ArenaContainer>
    );
  }

  const SkipButton = () => (
    <div css={baphStyles.skipButtonWrapper}>
      <Button
        variant="outline"
        size="medium"
        onClick={handleSkip}
        disabled={isVoting}
      >
        Skip this matchup
      </Button>
    </div>
  );

  const matchup: Matchup = data.getRandomMovieMatchup;

  return (
    <ArenaContainer>
      {voteResult && (
        <div
          css={[
            baphStyles.voteResult,
            voteResult.success ? baphStyles.voteSuccess : baphStyles.voteError
          ]}
        >
          {voteResult.message}
        </div>
      )}

      <div
        css={getMatchupContainerStyles({ isMobileAndLandscape, isLargeScreen })}
        className="arena-matchup-container"
      >
        <MovieCard
          movie={matchup.movie1}
          isVoting={isVoting}
          handleVote={handleVote}
        />

        <div css={baphStyles.vsAndSkipContainer}>
          <div css={baphStyles.vsContainer}>
            <div css={baphStyles.vsText}>VS</div>
          </div>
          {isMobileAndLandscape || isLargeScreen ? SkipButton() : null}
        </div>

        <MovieCard
          movie={matchup.movie2}
          isVoting={isVoting}
          handleVote={handleVote}
        />

        {!(isMobileAndLandscape || isLargeScreen) ? SkipButton() : null}
      </div>
    </ArenaContainer>
  );
};

const getMatchupContainerStyles = ({
  isMobileAndLandscape,
  isLargeScreen
}: {
  isMobileAndLandscape: boolean;
  isLargeScreen: boolean;
}) => {
  return {
    ...baphStyles.matchupContainer,
    flexDirection:
      isMobileAndLandscape || isLargeScreen
        ? ('row' as const)
        : ('column' as const)
  };
};

const baphStyles: { [key: string]: CSSObject } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    minHeight: '80vh',
    flexDirection: 'column'
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
    gap: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1200px',
    width: '100%',
    flexDirection: 'column'
  },
  vsAndSkipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem'
  },
  vsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  vsText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: baseVibrantColors.primary[300],
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    padding: '1rem',
    backgroundColor: baseColors.secondary[700],
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${baseVibrantColors.primary[500]}`,
    [mediaQueries.minWidth.lg]: {
      fontSize: '3rem',
      width: '80px',
      height: '80px'
    }
  },
  skipButtonWrapper: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    zIndex: 10
  }
};
