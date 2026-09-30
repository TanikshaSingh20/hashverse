# HashVerse

**Live demo:** [hashverse-pi.vercel.app](https://hashverse-pi.vercel.app/)

HashVerse is an interactive simulator for consistent hashing. Add or remove physical nodes, create keys, and watch how virtual nodes distribute data around a hash ring.

## What it demonstrates

- Physical nodes represented by virtual nodes on a consistent hash ring
- Key assignment and redistribution as nodes change
- A live cluster overview with event logs

## Stack

- Client: React, Vite, Tailwind CSS
- API: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Hosting: Vercel (client), Render (API)

## Run locally

Requirements: Node.js and a MongoDB connection string.

1. Configure the API:

	```sh
	cd server
	cp .env.example .env
	```

	Put your MongoDB connection string in `server/.env` as `MONGO_URI`. Keep this file private and never commit it.

2. Install dependencies and start the API:

	```sh
	npm ci
	npm start
	```

3. In a second terminal, start the client from the repository root:

	```sh
	cd client
	npm ci
	VITE_API_URL=http://localhost:5000/api/ring npm run dev
	```

	Open the local URL printed by Vite.

## Deployment

- **Client:** Deploy `client` as a Vite static site on Vercel. Build with `npm ci && npm run build` and publish `dist`.
- **API:** Deploy `server` as a Node.js web service on Render. Set `MONGO_URI` in Render's environment settings; never put it in the client or commit it.
- **Client API URL:** Set `VITE_API_URL` to `https://hashverse-server.onrender.com/api/ring` in Vercel. Vite embeds it at build time, so redeploy after changing it.
- **Health check:** `https://hashverse-server.onrender.com/health`
- **Cluster state:** `https://hashverse-server.onrender.com/api/ring/state`

The client defaults to the Render API URL above. For local development, override it with `http://localhost:5000/api/ring` as shown in the local setup.