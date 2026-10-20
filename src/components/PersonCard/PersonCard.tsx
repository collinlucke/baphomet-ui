import { isAuthenticatedVar } from '../../reactiveVars';
import { Button, color } from 'athameui';
import { useReactiveVar } from '@apollo/client/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { useLocation } from 'react-router-dom';

export type PersonProps = {
  id: number;
  name: string;
  role?: string;
  profilePath?: string;
  profileImages?: {
    w185?: string;
  };
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

  const showRemove =
    isAuthenticated &&
    isAdmin &&
    (pathname === '/add-movies') &&
    removePerson;
  const profileSrc =
    person.profileImages?.w185 ||
    (person.profilePath
      ? `https://image.tmdb.org/t/p/w185${person.profilePath}`
      : '');

  return (
    <div
      css={baphStyles.card}
      data-testid={`person-${person.id}`}
      data-name={person.name}
      aria-label={`Person card for ${person.name}`}
    >
      <div css={baphStyles.name}>{person.name}</div>
      <div css={baphStyles.imageContainer}>
        {showRemove && (
          <Button
            variant="ghost"
            size="small"
            onClick={removePersonHandler}
            icon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
            aria-label={`Remove ${person.name}`}
            sx={{ button: baphStyles.removePersonButton }}
          />
        )}
        {profileSrc ? (
          <img
            src={profileSrc}
            alt={person.name}
            css={baphStyles.image}
            draggable={false}
          />
        ) : (
          <div css={baphStyles.placeholder}>
            <HugeiconsIcon icon={UserIcon} size={48} />
          </div>
        )}
      </div>
      <div css={baphStyles.role}>{person.role}</div>
    </div>
  );
};

const baphStyles = {
  card: {
    backgroundColor: color.secondary[200],
    borderRadius: '5px',
    position: 'relative' as const,
    padding: '0 5px',
    overflow: 'hidden',
    display: 'flex',
    width: '125px',
    flexDirection: 'column' as const
  },
  image: {
    width: '100%',
    display: 'block'
  },
  imageContainer: {
    position: 'relative' as const
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: '2 / 3',
    backgroundColor: color.secondary[50],
    color: color.secondary[700]
  },
  removePersonButton: {
    padding: '0',
    position: 'absolute' as const,
    top: '5px',
    right: '5px',
    color: color.error.vibrant[700]
  },
  name: {
    fontWeight: '700',
    fontSize: '.75rem',
    color: color.secondary[800],
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
    color: color.secondary[800],
    padding: '5px 0',
    lineClamp: 1,
    overflow: 'hidden',
    scroll: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  }
};
