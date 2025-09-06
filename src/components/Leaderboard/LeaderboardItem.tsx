import { CSSObject } from '@emotion/react';
import { baphColors, baphColorVariations } from '../../styling/baphTheme';

type User = {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  totalVotes: number;
  joinDate: string;
  role: string;
  emailVerified: boolean;
};

type LeaderboardItemProps = {
  user: User;
  rank: number;
};

const podiumColors = {
  gold: {
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    shadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
    border: '2px solid #FFD700',
    glow: '0 0 20px rgba(255, 215, 0, 0.5)'
  },
  silver: {
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 50%, #808080 100%)',
    shadow: '0 6px 24px rgba(192, 192, 192, 0.3)',
    border: '2px solid #C0C0C0',
    glow: '0 0 15px rgba(192, 192, 192, 0.4)'
  },
  bronze: {
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 50%, #A0522D 100%)',
    shadow: '0 4px 16px rgba(205, 127, 50, 0.3)',
    border: '2px solid #CD7F32',
    glow: '0 0 12px rgba(205, 127, 50, 0.4)'
  }
};

const getRankDisplay = (rank: number): string => {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  user,
  rank
}) => {
  const rankStyles = getRankStyles(rank);
  const rankDisplay = getRankDisplay(rank);

  const getRankDisplayStyles = () => {
    return rank <= 3
      ? baphStyles.rankDisplayPodium
      : baphStyles.rankDisplayRegular;
  };

  const getNameStyles = () => {
    if (rank === 1) return baphStyles.nameFirst;
    if (rank === 2) return baphStyles.nameSecond;
    if (rank === 3) return baphStyles.nameThird;
    return baphStyles.nameRegular;
  };

  const getVoteCountStyles = () => {
    return rank <= 3 ? baphStyles.voteCountPodium : baphStyles.voteCountRegular;
  };

  return (
    <div css={rankStyles}>
      <div css={baphStyles.userInfo}>
        <div css={getRankDisplayStyles()}>{rankDisplay}</div>
        <div css={getNameStyles()}>{user.displayName || user.username}</div>
      </div>
      <div css={baphStyles.votes}>
        <div css={getVoteCountStyles()}>{user.totalVotes.toLocaleString()}</div>
        <div css={baphStyles.voteLabel}>
          {user.totalVotes === 1 ? 'vote' : 'votes'}
        </div>
      </div>
    </div>
  );
};

const getRankStyles = (rank: number): CSSObject => {
  const baseStyles = baphStyles.baseRank;

  if (rank === 1) {
    return {
      ...baseStyles,
      ...baphStyles.goldRank
    };
  }

  if (rank === 2) {
    return {
      ...baseStyles,
      ...baphStyles.silverRank
    };
  }

  if (rank === 3) {
    return {
      ...baseStyles,
      ...baphStyles.bronzeRank
    };
  }

  // Regular ranks (4+)
  return {
    ...baseStyles,
    ...baphStyles.regularRank
  };
};

const baphStyles: { [key: string]: CSSObject } = {
  baseRank: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    margin: '8px 0',
    borderRadius: '12px',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)'
    }
  },

  goldRank: {
    background: podiumColors.gold.gradient,
    boxShadow: `${podiumColors.gold.shadow}, ${podiumColors.gold.glow}`,
    border: podiumColors.gold.border,
    color: '#2C1810',
    fontWeight: 700,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: `${podiumColors.gold.shadow}, 0 0 30px rgba(255, 215, 0, 0.8)`
    }
  },

  silverRank: {
    background: podiumColors.silver.gradient,
    boxShadow: `${podiumColors.silver.shadow}, ${podiumColors.silver.glow}`,
    border: podiumColors.silver.border,
    color: '#2C2C2C',
    fontWeight: 600,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: `${podiumColors.silver.shadow}, 0 0 25px rgba(192, 192, 192, 0.6)`
    }
  },

  bronzeRank: {
    background: podiumColors.bronze.gradient,
    boxShadow: `${podiumColors.bronze.shadow}, ${podiumColors.bronze.glow}`,
    border: podiumColors.bronze.border,
    color: '#2C1810',
    fontWeight: 600,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: `${podiumColors.bronze.shadow}, 0 0 20px rgba(205, 127, 50, 0.6)`
    }
  },

  regularRank: {
    background: `linear-gradient(135deg, ${baphColorVariations.primary[100]} 0%, ${baphColorVariations.secondary[100]} 100%)`,
    border: `1px solid ${baphColorVariations.secondary[300]}`,
    color: baphColors.darkText,
    boxShadow: `0 2px 8px rgba(20, 107, 104, 0.1)`,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      background: `linear-gradient(135deg, ${baphColorVariations.secondary[200]} 0%, ${baphColorVariations.tertiary[200]} 100%)`,
      boxShadow: `0 4px 16px rgba(20, 107, 104, 0.2)`
    }
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  },

  rankDisplayPodium: {
    fontSize: '24px',
    fontWeight: 'bold',
    minWidth: '60px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },

  rankDisplayRegular: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center'
  },

  nameFirst: {
    fontSize: '20px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    flex: 1
  },

  nameSecond: {
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    flex: 1
  },

  nameThird: {
    fontSize: '16px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    flex: 1
  },

  nameRegular: {
    fontSize: '16px',
    fontWeight: 'normal',
    flex: 1
  },

  votes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },

  voteCountPodium: {
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },

  voteCountRegular: {
    fontSize: '16px',
    fontWeight: 'bold'
  },

  voteLabel: {
    fontSize: '12px',
    opacity: 0.8,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }
};
