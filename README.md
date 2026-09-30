# HashVerse

HashVerse is a React client and Express API for a distributed hash ring simulator.

## Deployment

Deploy `server` as a Node.js service and set `MONGO_URI` to a reachable MongoDB connection string in the host's environment settings. Keep the URI private; do not commit it. The service uses the host-provided `PORT` when available. Its health check is `GET /health`; the API is mounted at `/api/ring`.

Deploy `client` as a static Vite site with `npm ci` and `npm run build`; publish the generated `dist` directory. By default, the client calls `https://hashverse-server.onrender.com/api/ring`. Set `VITE_API_URL` to override that full API base URL, including `/api/ring`. Vite embeds this value at build time, so rebuild after changing it.

If the client and server share a domain, set `VITE_API_URL=/api/ring` and route `/api/ring` to the server. Do not use `localhost` as the production API host; visitors' browsers interpret it as their own computer.

## Local development

Copy `server/.env.example` to `server/.env` and provide a valid `MONGO_URI`. Start the API with `cd server && npm install && npm start`. In another terminal, start the client with `cd client && npm install && npm run dev`; set `VITE_API_URL=http://localhost:5000/api/ring` in `client/.env.local` for local development.