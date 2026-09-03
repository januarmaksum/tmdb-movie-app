# Movie Explorer

A dark, responsive movie-discovery application powered by TMDB. Browse current and highly rated releases, search the global catalog, load additional results, and open movie details with synopsis, director, and main cast information.

## Features

- Browse Now Playing, Popular, Top Rated, and Upcoming movies.
- Search by title with a debounced, shareable URL state.
- Load additional pages explicitly without losing existing results.
- Open responsive movie details with poster, synopsis, director, and the first 10 credited cast members.
- Recover from loading, empty, failed, and missing-data states.
- Navigate with keyboard-visible focus and accessible control labels.

## Live application

- Production: [movie-app-januarmaksum.vercel.app](https://movie-app-januarmaksum.vercel.app)
- Source: [github.com/januarmaksum/tmdb-movie-app](https://github.com/januarmaksum/tmdb-movie-app)

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4
- TanStack Query 5
- Axios
- TMDB API v3

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a TMDB API Read Access Token.

1. Install the locked dependencies:

```bash
npm ci
```

2. Create the local environment file:

```bash
cp .env.example .env.local
```

3. Add your TMDB API Read Access Token to `.env.local`:

```dotenv
TMDB_API_TOKEN=your_read_access_token
```

The token must remain server-only. Never prefix it with `NEXT_PUBLIC_`, and never commit `.env.local`.

4. Start the development server and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run build` | Create and validate the production build. |
| `npm run start` | Serve an existing production build. |
| `npm run lint` | Run ESLint across the repository. |

## Routes and URL state

- `/` opens the Popular catalog.
- `/?category=now_playing`, `popular`, `top_rated`, or `upcoming` opens a category directly.
- `/?category=popular&q=spider-man` restores a title search; the retained category becomes active when search is cleared.
- `/movies/{id}` opens a movie detail page for a positive TMDB movie ID.
- `/api/movies` and `/api/movies/{id}` are the browser-safe, normalized data endpoints.

