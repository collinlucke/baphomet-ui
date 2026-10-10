import { Carousel } from 'athameui';
import { PersonCard } from './PersonCard';
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
  const removePersonHandler = (id: number) => {
    if (removePerson) {
      removePerson(id, roleType);
    }
  };

  return (
    <Carousel emptyMessage={`No ${roleType} found.`}>
      {people.map(person => (
        <PersonCard
          key={person.id}
          person={person}
          removePerson={removePersonHandler}
        />
      ))}
    </Carousel>
  );
};
