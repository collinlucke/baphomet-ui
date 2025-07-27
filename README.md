# Baphomet UI

A modern movie database and management interface built with TypeScript, React, and Apollo GraphQL. This application provides a clean, accessible interface for browsing and managing movie data, with advanced contrast analysis and accessibility features powered by the PhantomArtist design system.

## Live Demo

🌐 **[View Live Application](https://baphomet.collinlucke.com)**  
🔐 **Sign Up**: Feel free to sign up and you can do such cool thing as log in and logout

---

## Features

- **Movie Database Management**: Browse, search, and manage movie collections
- **GraphQL Integration**: Efficient data fetching with Apollo Client
- **Accessibility-First Design**: Built-in contrast analysis and WCAG compliance checking
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, context, and performance optimizations
- **Design System Integration**: Powered by [PhantomArtist](https://github.com/collinlucke/phantomartist) design system

---

## Tech Stack

### Frontend Core

- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Styling & Design

- **Emotion CSS** - CSS-in-JS styling solution
- **PhantomArtist** - Custom design system library
- **Responsive Design** - Mobile-first approach

### Data & State

- **Apollo GraphQL** - GraphQL client with caching
- **GraphQL** - Query language for APIs
- **Cookie-based Auth** - Secure session management

### Development & Quality

- **ESLint** - Code linting and quality checks
- **Vitest** - Unit and integration testing
- **Hugeicons** - Icon library
- **Development Tools** - Port cleanup, accessibility analysis

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/collinlucke/baphomet-ui.git
cd baphomet-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Server Options

```bash
pnpm dev          # Start with automatic port cleanup (recommended)
pnpm dev:windows  # Windows PowerShell version
pnpm dev:simple   # Basic Vite server without cleanup
```

**📖 For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)**

---

## Accessibility Features

This application includes comprehensive accessibility analysis powered by PhantomArtist.

**📖 For complete accessibility commands and usage, see [DEVELOPMENT.md](./DEVELOPMENT.md#accessibility-analysis)**

### Quick Reference

During development (`pnpm dev`), these functions are available in the browser console:

- `analyzeFullSystem()` - Analyze all color combinations
- `analyzeComponent("ComponentName")` - Check specific components
- `analyzePage("PageName")` - Analyze specific pages
- `checkColors("#fg", "#bg", "context")` - Quick contrast checks

---

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── LoginForm.tsx   # Authentication forms
│   ├── SignupForm.tsx  # User registration
│   ├── Heading.tsx     # Typography components
│   └── ErrorBoundary.tsx # Error handling
├── styling/            # Theme and styling
│   ├── baphTheme.ts    # Application theme
│   └── normalizer.css  # CSS reset
├── utils/              # Utility functions
│   └── accessibilitySetup.ts # A11y configuration
├── tests/              # Test files
└── main.tsx           # Application entry point
```

### Design System Integration

Baphomet UI leverages the PhantomArtist design system for:

- **Contrast Analysis**: Automated WCAG compliance checking
- **Component Library**: Reusable UI components (InputField, etc.)
- **Typography System**: Consistent text styling
- **Color Management**: Accessible color combinations
- **Development Tools**: Browser console accessibility functions

---

## Backend Integration

This frontend connects to the [Baphomet Server](https://github.com/collinlucke/baphomet-server):

- **GraphQL API**: Movie data and user management
- **Authentication**: Cookie-based session handling
- **File Uploads**: Image and media management
- **Real-time Updates**: Live data synchronization

---

## Development Workflow

### Testing

```bash
pnpm test              # Run test suite
pnpm lint              # Check code quality
pnpm lint:fix          # Auto-fix linting issues
```

### Building

```bash
pnpm build             # Production build
pnpm preview           # Preview production build
```

### Port Management

The development server includes automatic port cleanup to prevent conflicts:

- Detects processes using port 5173
- Gracefully terminates conflicting processes
- Starts Vite on clean port 5173
- Cross-platform support (Bash + PowerShell)

---

## License

This project is part of the Collin Lucke development portfolio. See the live application for current licensing terms.

---

## Related Projects

- **[PhantomArtist](https://github.com/collinlucke/phantomartist)** - Design system library
- **[Baphomet Server](https://github.com/collinlucke/baphomet-server)** - GraphQL backend API

---

_Built with ❤️ using modern web technologies and accessibility-first principles._
