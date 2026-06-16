# LarisManis

LarisManis is a web application for estimating selling prices across online and offline sales channels. It helps sellers model platform fees, fixed costs, operating costs, target profit, and pricing scenarios in a single workflow.

## Overview

The project is built with the Next.js App Router and focuses on practical pricing workflows for marketplace sellers, food delivery merchants, resellers, and offline stores. In addition to price calculation, the application includes account authentication and browser-based calculation history.

## Key Features

- Multi-channel selling price calculator for online and offline sales
- Configurable fee presets for common sales channels
- Profit, margin, and payout simulation
- Saved calculation history per signed-in user
- Authentication with email/password and Google OAuth, with session handling managed through Supabase Auth

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth
- Zod

## Project Structure

- `app/` application routes and server-rendered pages
- `components/` reusable UI components
- `lib/` business logic, storage helpers, types, and Supabase utilities
- `public/` static assets

## Environment Variables

Create a `.env` file based on `.env.example`.

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application runs locally at `http://localhost:3000`.

## Available Scripts

- `npm run dev` start the local development server
- `npm run build` create a production build
- `npm run start` run the production build locally
- `npm run lint` run static lint checks

## Notes

- Authentication uses Google OAuth and email/password, with Supabase handling the authentication session layer.
- Calculation history is stored in the browser for the signed-in user context used by the app.

## License

This project is private and intended for internal development unless stated otherwise.
