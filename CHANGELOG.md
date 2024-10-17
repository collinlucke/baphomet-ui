# Changelog

## [0.1.2] - 2024-10-09

### Added

- Added `Welcome` page
- Created Theme Provider that can pass styles to PhantomArtist
- Add mysterious `Arena` page

### Changed

- Updated routing/navigation to accommodate the new `Welcome` page

### Removed

- Removed unused `AddMovie` component

### Fixed

- #### N/A

<br/>

## [0.1.1] - 2024-10-09

### Added

- #### N/A

### Changed

- Updated `cicd.yml` to store `GIT_REGISTRY_TOKEN` from `secrets`

### Removed

- #### N/A

### Fixed

- #### N/A

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

- #### N/A
