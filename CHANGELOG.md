# Changelog

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
