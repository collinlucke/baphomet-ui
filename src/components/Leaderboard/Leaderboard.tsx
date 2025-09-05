import { useEffect, useRef } from 'react';
import type { User } from '../../types/CustomTypes.types';
import { CircleArrowUp02Icon } from 'hugeicons-react';
import { LeaderboardItem } from './LeaderboardItem';

type LeaderboardProps = {
  leaderboard: User[];
  hasMore: boolean;
  isLoadingMore?: boolean;
  onScroll?: () => void;
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  hasMore,
  isLoadingMore = false,
  onScroll
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoadingMore) {
          onScroll?.();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isLoadingMore, onScroll]);

  return (
    <div ref={scrollRef}>
      <div>
        {leaderboard.map((user, index) => (
          <LeaderboardItem key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} style={{ height: '20px', margin: '10px' }}>
          {isLoadingMore && <p>Loading more users...</p>}
        </div>
      )}
      {!hasMore && leaderboard.length > 0 && (
        <p>
          This is the worst person ever! <CircleArrowUp02Icon size={20} />
        </p>
      )}
    </div>
  );
};
