import React from 'react';
import { isAuthenticatedVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { Button, baseColors } from 'phantomartist';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';

export type PersonProps = {
  id: number;
  name: string;
  role?: string;
  profilePath: string;
};

export const PersonCard: React.FC<{
  person: PersonProps;
  removePerson?: (id: number) => void;
}> = ({ person, removePerson }) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isAdmin = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}').role === 'admin'
    : false;

  const removePersonHandler = () => {
    if (removePerson) {
      removePerson(person.id);
    }
  };

  const profileImageUrl = person.profilePath
    ? `https://image.tmdb.org/t/p/w185${person.profilePath}`
    : 'https://via.placeholder.com/185x278?text=No+Image';

  return (
    <div
      css={baphStyles.card}
      data-testid={`person-${person.id}`}
      data-name={person.name}
      aria-label={`Person card for ${person.name}`}
    >
      <div css={baphStyles.name}>{person.name}</div>
      {person.profilePath && (
        <div css={baphStyles.imageContainer}>
          {isAuthenticated && isAdmin && (
            <Button
              variant="ghost"
              size="small"
              onClick={removePersonHandler}
              icon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
              ariaLabel={`Remove ${person.name}`}
              className={{ button: baphStyles.button }}
            />
          )}
          <img src={profileImageUrl} alt={person.name} />
        </div>
      )}
      <div css={baphStyles.role}>{person.role}</div>
    </div>
  );
};

const baphStyles = {
  card: {
    backgroundColor: baseColors.secondary[200],
    borderRadius: '5px',
    position: 'relative' as const,
    padding: '0 5px',
    flex: '0 0 110px',
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative' as const
  },
  button: {
    padding: '0',
    position: 'absolute' as const,
    top: '5px',
    right: '5px'
  },
  name: {
    fontWeight: '700',
    fontSize: '.75rem',
    color: baseColors.secondary[800],
    padding: '5px 0',
    lineClamp: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    lineHeight: '1.5rem'
  },
  role: {
    fontWeight: '600',
    fontSize: '.75rem',
    lineHeight: '1.5rem',
    color: baseColors.secondary[800],
    padding: '5px 0',
    lineClamp: 1,
    overflow: 'hidden',
    scroll: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  }
};
