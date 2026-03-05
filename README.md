# 🍳 Recipe Finder

A dynamic and responsive web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** that lets users search for recipes using [TheMealDB API](https://www.themealdb.com/api.php), view detailed recipe information, and manage a list of favorite recipes.

## Features

- **Search by Name** — Find recipes by typing a dish name (or part of it)
- **Search by Ingredient** — Filter recipes by a main ingredient
- **Filter by Category** — Browse recipes by food category (Seafood, Dessert, etc.)
- **Filter by Cuisine/Area** — Explore recipes from different world cuisines
- **Recipe Details** — View full instructions, ingredients with images, category, cuisine, tags, source link, and embedded YouTube video
- **Favorites** — Mark/unmark recipes as favorites with heart button; persisted in `localStorage`
- **Random Recipe** — Generate a random recipe with one click
- **Pagination** — "Load More" button for long result lists
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile screens
- **Loading & Error States** — Spinner while fetching, clear error messages with retry option
- **Client-Side Routing** — Navigate between Home, Recipe Detail, and Favorites pages
- **Unit Tests** — Key components and utility functions tested with Vitest + Testing Library

## Tech Stack

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI library              |
| TypeScript      | Type safety             |
| Vite            | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling   |
| React Router v7 | Client-side routing     |
| Vitest          | Unit testing            |
| Testing Library | Component testing       |
| TheMealDB API   | Recipe data source      |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) — install via `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Gagana/Recipe_Finder.git
cd Recipe_Finder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `pnpm dev`        | Start dev server with HMR           |
| `pnpm build`      | Type-check and build for production |
| `pnpm preview`    | Preview production build locally    |
| `pnpm test`       | Run unit tests                      |
| `pnpm test:watch` | Run tests in watch mode             |
| `pnpm lint`       | Lint with ESLint                    |

## Project Structure

```
src/
├── api/            # TheMealDB API service functions
├── components/
│   ├── common/     # Navbar, RecipeCard, Loader, ErrorMessage, PaginatedGrid
│   ├── favorites/  # Favorites page
│   ├── recipe/     # Recipe detail page
│   └── search/     # Search/home page with filters
├── context/        # React Context for favorites state
├── hooks/          # Custom hooks (useFetch)
├── test/           # Unit tests
├── types/          # TypeScript type definitions
├── utils/          # localStorage helpers for favorites
├── App.tsx         # Root component with routing
├── main.tsx        # Entry point
└── index.css       # Tailwind imports & custom styles
```

## Design Choices

- **Context API** over Redux for state management — the favorites state is simple enough that a single context provides clean, lightweight sharing without extra dependencies
- **Tailwind CSS v4** for rapid, consistent styling with utility classes embedded directly in components
- **Custom `useFetch` hook** to DRY up async data fetching with built-in loading/error states
- **URL search params** for search state so results are bookmarkable and shareable
- **"Load More" pagination** over traditional pagination for a smoother browsing experience
- **localStorage persistence** for favorites — simple, works offline, no backend needed
- **Component composition** with small, focused components (`RecipeCard`, `Loader`, `ErrorMessage`, `PaginatedGrid`) for reusability

## Deployment

Deploy to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Developer

- **Name:** Gagana Methmal
- **LinkedIn:** [https://www.linkedin.com/in/gagana-methmal/](https://www.linkedin.com/in/gagana-methmal/)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
