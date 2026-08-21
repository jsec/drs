# DRS Web

React app for the Data Retrieval System.

## Getting Started

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:4200`.

## Scripts

```bash
pnpm build
pnpm lint
pnpm test
```

## Routing

This app uses [TanStack Router](https://tanstack.com/router) with file-based
routes in `src/routes`.

## Styling

This project uses [Mantine 9](https://mantine.dev/) as its base component
library. The theme override lives in `src/lib/mantine-theme.ts`.

## Data Fetching

TanStack Query is available through the router context. Use route loaders or
client components to fetch data from the API app.
