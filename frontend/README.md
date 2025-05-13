# Docker Buster Frontend

A modern, responsive frontend for Docker Buster, a container security scanning tool. Built with Next.js 15 and leveraging v0.dev's design system.

## Tech Stack

- **Framework**: Next.js 15.2 with App Router
- **UI Components**: shadcn/ui with v0.dev design system
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Language**: TypeScript
- **Build Tool**: Next.js built-in tooling

## Directory Structure

```
frontend/
├── app/                # Next.js App Router files
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/             # UI primitives from shadcn/ui
│   └── ...             # Feature components
├── lib/                # Utility functions
├── public/             # Static assets
└── ...                 # Config files
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or another package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd labs/docker-buster/frontend
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the App

Development mode:
```bash
npm run dev
```

The app will be available at http://localhost:3000.

Building for production:
```bash
npm run build
npm start
```

## Features

- Responsive UI that adapts to mobile, tablet, and desktop views
- Dark mode by default
- Real-time scanning progress visualization
- Interactive risk assessment dashboard
- Vulnerability reporting and visualization
- PDF and JSON report generation

## Recent Updates

The frontend has been completely rebuilt with v0.dev's design system and the latest Next.js features. This rebuild:

- Moves from a src/ based architecture to standard Next.js App Router
- Adopts modern shadcn/ui components
- Implements token-based styling through Tailwind
- Provides improved performance and accessibility
- Offers comprehensive dark mode support 