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

const getRankStyles = (rank: number): CSSObject => {
  const baseStyles: CSSObject = {
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
  };

  if (rank === 1) {
    return {
      ...baseStyles,
      background: podiumColors.gold.gradient,
      boxShadow: `${podiumColors.gold.shadow}, ${podiumColors.gold.glow}`,
      border: podiumColors.gold.border,
      color: '#2C1810',
      fontWeight: 700,

      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: `${podiumColors.gold.shadow}, 0 0 30px rgba(255, 215, 0, 0.8)`
      }
    };
  }

  if (rank === 2) {
    return {
      ...baseStyles,
      background: podiumColors.silver.gradient,
      boxShadow: `${podiumColors.silver.shadow}, ${podiumColors.silver.glow}`,
      border: podiumColors.silver.border,
      color: '#2C2C2C',
      fontWeight: 600,

      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: `${podiumColors.silver.shadow}, 0 0 25px rgba(192, 192, 192, 0.6)`
      }
    };
  }

  if (rank === 3) {
    return {
      ...baseStyles,
      background: podiumColors.bronze.gradient,
      boxShadow: `${podiumColors.bronze.shadow}, ${podiumColors.bronze.glow}`,
      border: podiumColors.bronze.border,
      color: '#2C1810',
      fontWeight: 600,

      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: `${podiumColors.bronze.shadow}, 0 0 20px rgba(205, 127, 50, 0.6)`
      }
    };
  }

  // Regular ranks (4+)
  return {
    ...baseStyles,
    background: `linear-gradient(135deg, ${baphColorVariations.primary[100]} 0%, ${baphColorVariations.secondary[100]} 100%)`,
    border: `1px solid ${baphColorVariations.secondary[300]}`,
    color: baphColors.darkText,
    boxShadow: `0 2px 8px rgba(20, 107, 104, 0.1)`,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      background: `linear-gradient(135deg, ${baphColorVariations.secondary[200]} 0%, ${baphColorVariations.tertiary[200]} 100%)`,
      boxShadow: `0 4px 16px rgba(20, 107, 104, 0.2)`
    }
  };
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

  const userInfoStyles: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  };

  const rankDisplayStyles: CSSObject = {
    fontSize: rank <= 3 ? '24px' : '18px',
    fontWeight: 'bold',
    minWidth: rank <= 3 ? '60px' : '50px',
    textAlign: 'center',
    textShadow: rank <= 3 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
  };

  const nameStyles: CSSObject = {
    fontSize:
      rank === 1 ? '20px' : rank === 2 ? '18px' : rank === 3 ? '16px' : '16px',
    fontWeight: rank <= 3 ? 'bold' : 'normal',
    textShadow: rank <= 3 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
    flex: 1
  };

  const votesStyles: CSSObject = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  };

  const voteCountStyles: CSSObject = {
    fontSize: rank <= 3 ? '18px' : '16px',
    fontWeight: 'bold',
    textShadow: rank <= 3 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
  };

  const voteLabelStyles: CSSObject = {
    fontSize: '12px',
    opacity: 0.8,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  return (
    <div css={rankStyles}>
      <div css={userInfoStyles}>
        <div css={rankDisplayStyles}>{rankDisplay}</div>
        <div css={nameStyles}>{user.displayName || user.username}</div>
      </div>
      <div css={votesStyles}>
        <div css={voteCountStyles}>{user.totalVotes.toLocaleString()}</div>
        <div css={voteLabelStyles}>
          {user.totalVotes === 1 ? 'vote' : 'votes'}
        </div>
      </div>
    </div>
  );
};
