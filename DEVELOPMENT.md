# Development Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (recommended)
pnpm dev

# Other development options
pnpm dev:windows  # Windows PowerShell version
pnpm dev:simple   # Basic Vite without port cleanup
```

## Development Server Options

### `pnpm dev` (Recommended)

- **Cross-platform port cleanup**: Automatically detects and terminates processes using port 5173
- **Clean startup**: Ensures Vite starts on port 5173 without conflicts
- **Uses bash script**: Works on Windows with WSL/Git Bash

### `pnpm dev:windows`

- **Windows PowerShell version**: Native PowerShell script for Windows
- **Same port cleanup functionality**: Terminates conflicting processes
- **Alternative for Windows users**: If bash version doesn't work

### `pnpm dev:simple`

- **Basic Vite server**: Original `vite` command without modifications
- **No port cleanup**: May start on alternative ports if 5173 is busy
- **Fallback option**: If cleanup scripts cause issues

## Testing & Quality

```bash
# Run test suite
pnpm test

# Code linting
pnpm lint           # Check for issues
pnpm lint:fix       # Auto-fix issues

# Build commands
pnpm build          # Production build
pnpm preview        # Preview build locally
```

## Port Management

The development server includes automatic port cleanup to prevent common development issues:

1. **Detection**: Scans for processes using port 5173
2. **Cleanup**: Gracefully terminates conflicting processes
3. **Startup**: Starts Vite on clean port 5173
4. **Cross-platform**: Supports both Bash and PowerShell

This eliminates the need to manually kill processes or deal with Vite starting on random ports.
