# PhantomArtist Development Setup

This document explains how to set up local development with PhantomArtist.

## Quick Start

### For Local PhantomArtist Development:

```bash
# Setup and run with local PhantomArtist
pnpm dev:local

# Or setup PhantomArtist first, then run
pnpm setup:phantomartist
pnpm dev:local
```

### For Production PhantomArtist:

```bash
# Use published PhantomArtist package
pnpm dev:prod
```

## Development Workflows

### 1. Standard Development (Auto-Detection)

```bash
pnpm dev
```

This will automatically detect your environment and use local PhantomArtist if available.

### 2. Local PhantomArtist Development

```bash
# One-time setup (builds PhantomArtist)
pnpm setup:phantomartist

# Run with local PhantomArtist
pnpm dev:local
```

### 3. PhantomArtist + baphomet-ui Watch Mode

In two terminals:

Terminal 1 (PhantomArtist watch):

```bash
pnpm dev:watch
```

Terminal 2 (baphomet-ui):

```bash
pnpm dev:local
```

### 4. Production Testing

```bash
# Test with published PhantomArtist
pnpm dev:prod

# Build for production
pnpm build
```

## Environment Variables

The setup uses these environment variables:

- `.env.development` - Local development settings
- `.env.production` - Production settings
- `.env.local` - Local overrides (gitignored)

Key variables:

- `VITE_USE_LOCAL_PHANTOMARTIST=true/false` - Controls PhantomArtist source
- `VITE_NODE_ENV=development/production` - Environment mode

## Scripts Explained

| Script                     | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `pnpm dev`                 | Auto-detects environment, runs dev server       |
| `pnpm dev:local`           | Forces local PhantomArtist, runs dev server     |
| `pnpm dev:prod`            | Forces published PhantomArtist, runs dev server |
| `pnpm dev:watch`           | Runs PhantomArtist in watch mode                |
| `pnpm setup:local`         | Configures for local PhantomArtist              |
| `pnpm setup:prod`          | Configures for published PhantomArtist          |
| `pnpm setup:phantomartist` | Full PhantomArtist setup (install + build)      |
| `pnpm build`               | Production build with published PhantomArtist   |
| `pnpm build:local`         | Development build with local PhantomArtist      |

## Directory Structure Expected

```
git/
├── baphomet-ui/          # This project
├── phantomartist/        # Local PhantomArtist repo
└── ...
```

## Troubleshooting

### PhantomArtist not found

Ensure PhantomArtist is cloned at `../phantomartist` relative to baphomet-ui.

### Build failures

Run `pnpm setup:phantomartist` to rebuild PhantomArtist dependencies.

### Environment issues

Check your `.env.local` file and ensure variables are set correctly.

### Dependency conflicts

Try:

```bash
pnpm setup:prod  # Switch to production
pnpm setup:local # Switch back to local
```
