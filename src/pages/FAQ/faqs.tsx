import { CSSObject } from '@emotion/react';

const baphStyles: { [key: string]: CSSObject } = {
  baphy: {
    width: '300px',
    height: '300px',
    objectFit: 'contain'
  }
};

export const questions = [
  {
    q: 'What is this thing?',
    a: (
      <div>
        Baphomet is thing that creates overall movie ratings (scores) based on
        user community input.
      </div>
    )
  },
  {
    q: 'What is a Baphomet?',
    a: (
      <div>
        Baphomet is a goat-headed, deity-ish thing often associated with occulty
        stuff. Usually representative of the duality of things like good and
        evil, light and dark, or literally any movie and Captain Marvel.
      </div>
    )
  },
  {
    q: "Isn't a Baphomet evil? Isn't Baphomet a satan?",
    a: (
      <div>
        Without the history lesson, no. Also, how could you call this cute
        fuggin' thing evil!?
        <img
          src="/baphy-full-transparent.png"
          alt="Baphomet logo"
          css={baphStyles.baphy}
          role="presentation"
          aria-hidden="true"
        />{' '}
      </div>
    )
  },
  {
    q: 'How the fuh does Baphomet work?',
    a: (
      <>
        <div>
          Baphomet works by showing you two movies. You pick the one you like
          better, rinse, and repeat. As more and more users vote on more and
          more matchups, magic behind the scenes generates a score for each
          movie.
        </div>
        <br />
        <div>
          In this pre-pre-alpha version, there are 250 movies to rank - the top
          10 highest grossing movies of each year from 2000-2024. Hopefully any
          y'all trying this out will have seen a good chunk of these. If you
          haven't seen one or both of the movies you're shown, there's a "Skip
          This Matchup" button to give you a new set of movies to duel over.
        </div>
      </>
    )
  },
  {
    q: "What's that blue number on each movie poster? It's kinda in the way.",
    a: (
      <div>
        That blue number is the Baphomet score, which represents the overall
        rating of the movie based on user votes. The higher the score, the more
        the vox populi like it. If you really don't like seeing it... I dunno,
        cover it up with your finger.
      </div>
    )
  },
  {
    q: 'Why should I use Baphomet?',
    a: (
      <div>
        Cuz you like movies. Cuz you like being judgey. Cuz you like
        clicking/tapping on things. Cuz you love me. Cuz you need something to
        do while on the toilet. Cuz you want to help create something new and
        cool. Cuz your hole game is getting too demanding. Just cuz.
      </div>
    )
  },
  {
    q: "Why isn't this a mobile app?",
    a: (
      <>
        <div>
          While making this app has been the culmination of years of thinkiness
          on the topic of creating a objectively subjective* movie ranking
          system, a major factor in building Baphomet is as a portfolio piece to
          show off my web developer skills. Making a mobile app is a bit of a
          different beast, but I hope to get there eventually.
        </div>
        <br />
        <div>*Subjectively objective?**</div>
        <br />
        <div>**What?</div>
      </>
    )
  }
];
