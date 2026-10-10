import { isAuthenticatedVar } from '../../reactiveVars';
import { Button, tokens } from 'athameui';
import { useReactiveVar } from '@apollo/client/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { useLocation } from 'react-router-dom';

export type PersonProps = {
  id: number;
  name: string;
  role?: string;
  profilePath?: string;
  __typename?: string;
};

export type RemovePersonFunction = (
  personId: number,
  personType: string
) => void;

type PersonCardProps = {
  person: PersonProps;
  removePerson?: RemovePersonFunction;
};

export const PersonCard = ({ person, removePerson }: PersonCardProps) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const isAdmin = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}').role === 'admin'
    : false;

  const { pathname } = useLocation();

  const removePersonHandler = () => {
    if (removePerson && person.__typename) {
      removePerson(person.id, person.__typename);
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
          {isAuthenticated && isAdmin && pathname === '/add-movies' && (
            <Button
              variant="ghost"
              size="small"
              onClick={removePersonHandler}
              icon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
              aria-label={`Remove ${person.name}`}
              sx={{ button: baphStyles.button }}
            />
          )}
          <img src={profileImageUrl} alt={person.name} css={baphStyles.image} />
        </div>
      )}
      <div css={baphStyles.role}>{person.role}</div>
    </div>
  );
};

const baphStyles = {
  card: {
    backgroundColor: tokens.color.secondary[200],
    borderRadius: '5px',
    position: 'relative' as const,
    padding: '0 5px',
    flex: '0 0 110px',
    overflow: 'hidden',
    maxHeight: '225px'
  },
  image: {
    width: '100%'
  },
  imageContainer: {
    position: 'relative' as const
  },
  button: {
    padding: '0',
    position: 'absolute' as const,
    top: '5px',
    right: '5px',
    color: tokens.color.error.vibrant[700]
  },
  name: {
    fontWeight: '700',
    fontSize: '.75rem',
    color: tokens.color.secondary[800],
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
    color: tokens.color.secondary[800],
    padding: '5px 0',
    lineClamp: 1,
    overflow: 'hidden',
    scroll: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  }
};
