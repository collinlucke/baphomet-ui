# Baphomet UI

A movie ranking application where users compare two movies at a time to build aggregate scores. Users vote on their preferences, and the collective data creates rankings for each movie in the database.

## Live Demo

🌐 **[View Live Application](https://baphomet.collinlucke.com)**

---

## Current Features

- **User Registration** - Sign up to be able to rate movies
- **Rate Movies** - Go to the Arena and pick your favorites
- **Movie List** - Search for movies in the database to directly see their score and info
- **Log In/Log Out** - Because you can
- **View Profile** - Change user name, password, and other info
- **Add Movies to Database** - Search TMDb for movies to add to the Baphomet database by title or TMDb ID - Requires admin privileges but you can see the code for it [here](https://github.com/collinlucke/baphomet-ui/tree/main/src/pages/AddMovies)

## Roadmap

- **Refactor to Next.js App** - Cuz, why not?!

## Tech Stack

- **React** with TypeScript
- **Vite** - Build tool and dev server[^1]
- **Apollo GraphQL** - Data fetching and state management[^1]
- **JSON Web Tokens** - Authentication and authorization
- **Emotion CSS** - CSS-in-JS styling[^2]
- **PhantomArtist** - Custom design system[^3]
- **Vitest** - Testing framework[^1]
- **ESLint** - Code quality

[^1]: Will all likely be replaced with Next.js stuff
[^2]: Moving to the Next.js-blessed Tailwind CSS
[^3]: Will be using a diffent custom component library built off of PahntomArtist
---

## Related Projects

- **[Baphomet Server](https://github.com/collinlucke/baphomet-server)** - GraphQL backend API
- **[PhantomArtist](https://github.com/collinlucke/phantomartist)** - Design system library

