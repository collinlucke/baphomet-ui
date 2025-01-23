# Changelog

## [0.3.4] - 2025-01-23

### Added

- ### N/A

### Changed

- ### N/A

### Removed

- ### N/A

### Fixed

- Made the debounce actually work right

<br/>

## [0.3.3] - 2025-01-20

### Added

- Created a debouncer function to debounce the search term
- Added login and logout buttons

### Changed

- Gussied up the login page a bit
- Fixed up the UI in the MovieListPage

### Removed

- ### N/A

### Fixed

- ### N/A

<br/>

## [0.3.0] - 2024-10-12

### Added

- ### N/A

### Changed

- Switched from the Context API to Reactive Variables

### Removed

- ### N/A

### Fixed

- ### N/A

<br/>

## [0.2.1] - 2024-10-12

### Added

- Unit/integration tests for Heading and App components and all the fixin's -- snapshots, mock util functions, mock localStorage, data-testid's (used as dataTestId to pass to PA components), mock context functions

### Changed

- Changed up cicd.yml -- switched it back to building in linux and simplified it the build steps. Got to sort out deploy. and added testing to the workflow

### Removed

- ### N/A

### Fixed

- useRouterError is now using the right context

<br/>

## [0.2.0] - 2024-17-11

### Added

- Adding nginx.conf so connecting to baphomet-server's docker container actually works

### Changed

- Updated main.js to use real .env variables and not the Vite ones.
- Revamped the docker-compose.yml to work in the same network as baphomet-server.
- Dockerfile using nginx in a way that makes thing do the things

### Removed

- Got rid of the all the dist moving stuff since everything we need should be here now.
- Got rid of the stupid thing I had foe Windows permissions

### Fixed

- All the stuff around the ui and server not connecting

<br/>

## [0.2.0] - 2024-17-11

### Added

- Adding nginx.conf so connecting to baphomet-server's docker container actually works

### Changed

- Updated main.js to use real .env variables and not the Vite ones.
- Revamped the docker-compose.yml to work in the same network as baphomet-server.
- Dockerfile using nginx in a way that makes thing do the things

### Removed

- Got rid of the all the dist moving stuff since everything we need should be here now.
- Got rid of the stupid thing I had foe Windows permissions

### Fixed

- All the stuff around the ui and server not connecting

<br/>

## [0.1.7] - 2024-23-09

### Added

- Error handling
- Created context for showing the heading

### Changed

- Switch back to `createBrowserRouter` from `createHashRouter`

### Removed

- ### N/A

### Fixed

- ### N/A

<br/>

## [0.1.6] - 2024-23-09

### Added

- ### N/A

### Changed

- Updated some packages

### Removed

- ### N/A

### Fixed

- Fixed weird `<ButtonGroup>` (for now)

<br/>

## [0.1.5] - 2024-23-09

### Added

- Prepped for using `BaphThemeProvider`
- Implemented `deleteMovie` functionality

### Changed

- Some small theming and typing changes

### Removed

- Deleted `main-w-ts.tsx`

### Fixed

<br/>

## [0.1.4] - 2024-18-09

### Added

- ### N/A

### Changed

- Reorganized files and directories
- Flattened route structure

### Removed

- ### N/A

### Fixed

- Made it so when a user enter something like `collinlucke.com/create`, it will redirect to
  `collinlucke.com/#/create/`
- Fixed some routing issues when navigating away from the `LoginPage`

<br/>

## [0.1.3] - 2024-17-09

### Added

- Implemented `Modal` from `PhantomArtist`

### Changed

- ### N/A

### Removed

- Removed unused `withAuth` method.

### Fixed

- Routing bug that was letting the `WelcomePage` show even though `beenHereBefore` was already `yup`
- Some small styling changes

<br/>

## [0.1.2] - 2024-17-09

### Added

- Added `Welcome` page
- Created Theme Provider that can pass styles to PhantomArtist
- Add mysterious `Arena` page

### Changed

- Updated routing/navigation to accommodate the new `Welcome` page

### Removed

- Removed unused `AddMovie` component

### Fixed

- ### N/A

<br/>

## [0.1.1] - 2024-10-09

### Added

- ### N/A

### Changed

- Updated `cicd.yml` to store `GIT_REGISTRY_TOKEN` from `secrets`

### Removed

- ### N/A

### Fixed

- ### N/A

<br/>

## [0.1.0] - 2024-10-09

### Added

- CHANGELOG.md
- Emotion css
- baphTheme.ts

### Changed

- Updated the README
- Changed `set-dependencies.ts` to only worry about pulling in the published version of
  PhantomArtist in prod
- Updated `vite.config.mjs` to use Emotion css
- Switched from `createBrowserRouter` to `createHashRouter` due to routing breaks
- Made `Heading.tsx` use PhantomArtist's `<Heading>` instead of `<HeadingMain>` and made the
  appropriate updates to it works.
  - `styleX.css` to `index.css`

### Removed

- Stylex - Juice wasn't worth the squeeze

### Fixed

- ### N/A
