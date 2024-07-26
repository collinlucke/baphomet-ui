import React, { ChangeEvent, useState } from 'react';
import { ListItem } from '@crazy-overlord/phantomartist';

type MovType = {
  id: string;
  poster?: string;
  year?: number;
  rated?: string;
  title?: string;
};

export const MovieListItem = ({ mov }: { mov: MovType }) => {
  const { id, year, title, rated, poster } = mov;
  const [showPoster, setShowPoster] = useState(false);
  const onClickHandler = () => {
    setShowPoster(!showPoster);
  };

  return (
    <ListItem id={mov.id}>
      <div onClick={onClickHandler} id={id}>
        {title} ---- Released {year} ----- Rated ----- {rated ? rated : '?'}{' '}
        {poster &&
          `---- Click to
    ${showPoster ? 'hide' : 'show'} poster`}
        {showPoster && poster && <img src={poster} />}
      </div>
    </ListItem>
  );
};
