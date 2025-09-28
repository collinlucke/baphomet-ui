import { isMobileVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { PersonCard } from './PersonCard';
import { baseColors } from '@collinlucke/phantomartist';
import type { PersonProps } from './PersonCard';

type PersonCardCarouselProps = {
  people: PersonProps[];
  roleType?: string;
  removePerson?: (id: number, roleType?: string) => void;
};

export const PersonCardCarousel = ({
  people,
  roleType = 'people',
  removePerson
}: PersonCardCarouselProps) => {
  const isMobile = useReactiveVar(isMobileVar);

  const removePersonHandler = (id: number) => {
    if (removePerson) {
      removePerson(id, roleType);
    }
  };

  return (
    <div
      css={baphStyles.carousel}
      className={`person-card-carousel ${!isMobile ? 'scrollable' : ''}`}
    >
      {people.length === 0 && `No ${roleType} found.`}
      {people.map(person => (
        <PersonCard
          key={person.id}
          person={person}
          removePerson={removePersonHandler}
        />
      ))}
    </div>
  );
};

const baphStyles = {
  carousel: {
    display: 'flex',
    border: `5px solid ${baseColors.secondary[800]}`,
    borderRadius: '10px',
    padding: '10px',
    overflowX: 'auto' as const,
    gap: '10px'
  }
};
