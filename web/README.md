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

This project uses [Mantine](https://mantine.dev/) as its base component library.
Global styles are limited to Mantine's core stylesheet and document-level
defaults in `src/styles.css`.

## Data Fetching

TanStack Query is available through the router context. Use route loaders or
client components to fetch data from the API app.
