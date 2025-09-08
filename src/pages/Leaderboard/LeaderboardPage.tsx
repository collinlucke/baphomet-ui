import { useEffect, useState, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { BodySection } from '../../components/BodySection';
import { PageHeading } from '../../components/PageHeading';
import { Leaderboard } from '../../components/Leaderboard/Leaderboard';
import { GET_USER_LEADERBOARD } from '../../api/queries';
import type { User, LeaderboardType } from '../../types/CustomTypes.types.ts';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [cursor, setCursor] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isNewSearchRef = useRef(true);

  console.log('LeaderboardPage mounted');

  const [fetchLeaderboard, { data, error }] =
    useLazyQuery(GET_USER_LEADERBOARD);

  useEffect(() => {
    if (data) {
      const leaderboardData = data as LeaderboardType;
      const { users, newCursor, endOfResults } = leaderboardData.leaderboard;

      if (isNewSearchRef.current) {
        setLeaderboard(users || []);
        isNewSearchRef.current = false;
      } else {
        setLeaderboard(prev => {
          const incoming = users || [];
          const existingIds = new Set(prev.map(u => u.id));
          const filtered = incoming.filter((u: User) => !existingIds.has(u.id));
          return [...prev, ...filtered];
        });
      }

      setCursor(newCursor || '');
      setHasMore(!endOfResults);
      setIsLoadingMore(false);
    }
  }, [data]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching leaderboard:', error);
      setIsLoadingMore(false);
    }
  }, [error]);

  const fetchMoreUsers = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchLeaderboard({ variables: { cursor } });
  };

  useEffect(() => {
    fetchLeaderboard({ variables: { cursor: '' } });
  }, [fetchLeaderboard]);

  return (
    <BodySection>
      <PageHeading
        title="Leaderboard"
        subtitle="Basically, it's a quantifiable list of who's better than you."
      />
      <Leaderboard
        leaderboard={leaderboard}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onScroll={fetchMoreUsers}
      />
    </BodySection>
  );
};
