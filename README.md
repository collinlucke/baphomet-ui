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
- **Add Movies to Database** - Search TMDb for movies to add to the Baphomet database by title or TMDb ID - Requires admin privileges

## Roadmap

- **Movie Details** - Click on a movie in the list to see more about it.
- **Leaderboard** - The more you rate the higher you rank
- **Upgrade to React 19** - Cuz it's 2025

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Apollo GraphQL** - Data fetching and state management
- **JSON Web Tokens** - Authentication and authorization
- **Emotion CSS** - CSS-in-JS styling
- **PhantomArtist** - Custom design system
- **Vitest** - Testing framework
- **ESLint** - Code quality

---

## Related Projects

- **[Baphomet Server](https://github.com/collinlucke/baphomet-server)** - GraphQL backend API
- **[PhantomArtist](https://github.com/collinlucke/phantomartist)** - Design system library

---

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```
