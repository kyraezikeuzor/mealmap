# <img src="public/waylarm-logo.png" alt="Logo" width="30"> MealMap: Find Food Resources Near You

**MealMap** is a web app I built with [Next.js](https://nextjs.org) to help people find food banks and community food resources across the United States. It uses OpenStreetMap for the map and stores all the food bank information in a Supabase database.

Website: **https://mealmap.vercel.app**  

## Features
- **Interactive Map**: Shows food bank markers across the country using OpenStreetMap.
- **Food Bank List**: A sidebar with all the food banks on the site, which you can filter by state.
- **Info Popups**: Click a marker or a card to see details like the address, contact info, and ways to visit, donate, or volunteer.

## Getting Started

If you want to run MealMap locally:

1. Clone the repo:
   ```bash
   git clone https://github.com/kyraezikeuzor/mealmap.git
   cd mealmap

2.	Install everything:

npm install
yarn install
pnpm install

3.	Start the dev server:

npm run dev
yarn dev
pnpm dev

4.	Open http://localhost:3000￼ to see it in your browser.

## What I Used
	•	Next.js + TypeScript for the app
	•	OpenStreetMap for the map
	•	Supabase for storing the food bank data
	•	Firecrawl.dev to help gather food bank information

# Deployment

I deployed MealMap using Vercel because it works well with Next.js and updates automatically whenever I push new code.
