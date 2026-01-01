# Build a Life - Stoic Practice App

A Next.js web application for daily Stoic practice, incorporating three core philosophical concepts:

1. **The Nightly Audit** (Sextius) - Daily reflection on habits checked and improvements made
2. **Stoic Mastery** (Epictetus) - Self-mastery practice to stop being managed by external desires
3. **Inner Peace** (Seneca) - Emotional management to reduce rumination and catastrophizing

## Features

### The Nightly Audit
- Daily reflection journal
- Track bad habits checked/avoided
- Note improvements made
- View past reflections (last 7 days)

### Stoic Mastery
- Daily practice checklist (Morning Intention, Desire Awareness, Present Moment Check, Evening Review)
- Reflection on present moment awareness
- Track external desires and self-control exercises
- Practice notes

### Inner Peace
- Quick emotional check-in buttons
- Track emotional extremes
- Monitor rumination and catastrophizing
- Document management strategies
- View check-ins throughout the day

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Data Storage

Currently, the app uses browser localStorage to persist data. All entries are stored locally in your browser. To upgrade to a database-backed solution, you can:

1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Create API routes in Next.js
3. Replace the storage utilities in `lib/storage.ts` with API calls

## Project Structure

```
build-a-life/
├── app/
│   ├── nightly-audit/     # Nightly Audit feature
│   ├── stoic-mastery/      # Stoic Mastery feature
│   ├── inner-peace/        # Inner Peace feature
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css          # Global styles
├── components/
│   └── navigation.tsx      # Navigation component
├── lib/
│   └── storage.ts           # Local storage utilities
└── package.json
```

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## Philosophy

This app is built on Stoic principles:

- **Self-awareness** through daily reflection
- **Self-mastery** by recognizing and managing external desires
- **Emotional regulation** to maintain inner peace and equanimity

## License

MIT

