# Traveller's Compass

A small full-stack web app for finding attractions in a city and saving favourites for trip planning. Built with a Node.js/Express backend and a vanilla JavaScript frontend.

## Features

- Search attractions by city name
- Attraction cards with name, category, description and image
- Save favourites and remove them again (stored in the browser's localStorage, so they survive a page reload)
- Loading and error states for failed or empty searches
- Responsive layout for mobile and desktop
- REST endpoint with input validation (`400` when no city is given)

## Screenshots

### Desktop
<img width="840" alt="Desktop view" src="https://github.com/user-attachments/assets/ec50f338-01e9-4c99-b20b-14287097c68c" />
<img width="840" alt="Search results" src="https://github.com/user-attachments/assets/7d37d974-1fa7-4507-bbed-b63e8f5f0bd2" />

### Mobile
<img width="840" alt="Mobile view" src="https://github.com/user-attachments/assets/72efedb4-1e90-4e92-a414-7b22e0e0c32e" />

### Favourites
<img width="840" alt="Favourites section" src="https://github.com/user-attachments/assets/a19af0cb-81fe-4077-9228-1ee70a2524a3" />

## How it works

```
Browser (HTML, CSS, JS)  ──  GET /api/places?city=paris  ──▶  Express server (Node.js)
        ▲                                                           │
        └──────────────────  JSON list of attractions  ◀────────────┘
Favourites are kept in the browser's localStorage.
```

The backend currently serves a curated sample dataset for **Paris, London, Tokyo and Rome**. The endpoint is written so the data source can be swapped for a live places API (for example OpenTripMap or Google Places) without changing the frontend.

## Tech stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | HTML5, CSS3, vanilla JavaScript (fetch, async/await) |
| Backend  | Node.js, Express                     |
| Storage  | Browser localStorage                 |

## Run it locally

Requirements: [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/Pritamhaldertech/travellers-compass.git
cd travellers-compass/backend
npm install
npm start
```

Then open http://localhost:3000 and search for `Paris`, `London`, `Tokyo` or `Rome`.

## API

| Method | Endpoint                  | Response |
|--------|---------------------------|----------|
| GET    | `/api/places?city=<name>` | `200` with an array of attractions (empty if the city is unknown), `400` if `city` is missing |

Example response:

```json
[
  { "name": "Eiffel Tower", "description": "Iconic iron lattice tower on the Champ de Mars, symbol of France.", "kind": "landmark", "image": "https://..." }
]
```

## Project structure

```
travellers-compass/
├── backend/
│   ├── server.js       # Express server and /api/places endpoint
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js       # search, rendering, favourites
```

## Possible next steps

- Connect a live places API behind the existing endpoint
- Add tests for the API (Jest + Supertest)
- Deploy the app (for example on Render)

## Author

Pritam Halder · [Portfolio](https://pritamhaldertech.github.io) · [LinkedIn](https://www.linkedin.com/in/pritamhaldertech)

Built for the IU course project DLBCSPJWD01 (Web Application Development).
