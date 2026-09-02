# TMDB Movie App - Prioritized Implementation Backlog

## Objective

Build and deploy a production-ready movie discovery application based on the requirements in `prd.pdf`. Users must be able to browse movies, search by title, filter by category, load additional results, and open a detail page containing the poster, synopsis, main cast, and director.

## Delivery Strategy

Do **not** build the complete UI before connecting real data. Use this order:

1. Define the data and API contract.
2. Build only the reusable visual foundation needed by the first screen.
3. Deliver one end-to-end Popular catalog slice using real TMDB data.
4. Add search, categories, pagination, and details incrementally.
5. Complete resilience, accessibility, documentation, and deployment checks.

This sequence exposes API, authentication, data-shape, and rendering risks early while avoiding a large mock UI that must be reworked later.

## Priority Definitions

- **P0 - Submission blocker:** Required by the PRD or necessary for the reviewer to use the deployed application.
- **P1 - Quality and interview readiness:** Important engineering quality that should be completed after all P0 behavior works.
- **P2 - Optional polish:** Only start after every P0 item and acceptance check passes.

## Recommended Execution Sequence

### 1. P0 - Project and API Foundation

**Dependencies:** None

- [ ] Install `axios` and `@tanstack/react-query`.
- [ ] Add a client-side `QueryClientProvider` at the narrowest appropriate App Router boundary.
- [ ] Configure a non-zero default `staleTime` to prevent an immediate duplicate refetch after hydration.
- [ ] Add a typed, centralized query-key factory for movie lists and movie details.
- [ ] Add `.env.example` containing an empty `TMDB_API_TOKEN` placeholder and setup guidance.
- [ ] Keep the real token in `.env.local`; never prefix it with `NEXT_PUBLIC_` or commit it.
- [ ] Create a server-only Axios client with the TMDB v3 base URL, bearer authorization, JSON headers, and a finite timeout.
- [ ] Define normalized TypeScript models for `MovieSummary`, `MovieDetails`, `CastMember`, `MoviePage`, and API errors.
- [ ] Implement server-side normalization so UI components do not depend on raw TMDB response objects.
- [ ] Add `GET /api/movies` for category lists and title search.
- [ ] Add `GET /api/movies/{id}` for details and credits.
- [ ] Validate category, page, query, and movie ID inputs before forwarding requests.
- [ ] Convert upstream failures into safe, consistent API responses without exposing the token or Axios internals.
- [ ] Configure `next/image` to allow only the required `https://image.tmdb.org/t/p/**` remote path.
- [ ] Provide a local poster fallback for missing `poster_path` values.

**Definition of done**

- The two internal endpoints return normalized data for valid requests.
- Missing or invalid input returns a clear 4xx response.
- Missing credentials and TMDB 401, 404, 429, and 5xx failures return safe error responses.
- The TMDB credential is absent from browser requests, client bundles, logs, and Git-tracked files.

**Suggested commit:** `feat: add secure tmdb data layer`

### 2. P0 - Minimal UI Foundation

**Dependencies:** Project and API foundation

- [ ] Replace the starter theme with a small set of reusable color, typography, spacing, radius, and focus tokens.
- [ ] Create the shared page container and header.
- [ ] Create reusable Search Input, Category Filter, Movie Card, Movie Grid, Skeleton Card, Empty State, and Error State components.
- [ ] Give interactive elements visible hover, active, disabled, and keyboard-focus states.
- [ ] Establish the responsive grid at mobile, tablet, and desktop widths.
- [ ] Keep this phase intentionally thin; do not finish the detail page or decorative polish yet.

**Definition of done**

- Shared primitives can render a representative movie and all feedback states using fixture data.
- The layout has no horizontal overflow at supported viewport sizes.
- Controls have semantic labels and visible keyboard focus.

**Suggested commit:** `feat: add movie ui foundations`

### 3. P0 - Popular Catalog Vertical Slice

**Dependencies:** API foundation and minimal UI foundation

- [ ] Make Popular the default category.
- [ ] Prefetch the first Popular page in the Server Component and hydrate it into TanStack Query.
- [ ] Use the same typed query key for server prefetching and client cache access.
- [ ] Render the normalized results in the responsive Movie Grid.
- [ ] Show poster, title, and release year on every card.
- [ ] Use a meaningful poster alt attribute and stable image dimensions to avoid layout shift.
- [ ] Link every card to `/movies/{id}`.
- [ ] Display a fallback poster and `Year unavailable` when source data is missing.
- [ ] Add initial loading skeletons, empty results, error feedback, and a retry action.

**Definition of done**

- A fresh request renders real Popular movies without exposing the TMDB token.
- Hydrated data does not immediately refetch or flash back to a loading state.
- Every rendered card contains the required PRD fields and the correct detail URL.

**Suggested commit:** `feat: build popular movie catalog`

### 4. P0 - Search and Category Filters

**Dependencies:** Working Popular catalog

- [ ] Add Now Playing, Popular, Top Rated, and Upcoming category controls.
- [ ] Use only the supported `MovieCategory` values in UI state, query keys, and API validation.
- [ ] Add a controlled title search input with a 350 ms debounce.
- [ ] Trim search input before issuing a request; whitespace-only input restores category mode.
- [ ] Store the current category and search query in URL search parameters using `category` and `q`.
- [ ] Entering a non-empty search switches the catalog to search mode.
- [ ] Selecting a category clears the current search and returns to category mode.
- [ ] Reset pagination whenever the category or normalized search query changes.
- [ ] Include the mode, category, and normalized query in the TanStack Query key so caches cannot mix.
- [ ] Mark the selected category accessibly and support keyboard operation.
- [ ] Show distinct pending, no-results, failed, and retrying states without clearing valid prior content unnecessarily.

**Definition of done**

- All four category endpoints produce the correct list.
- Search requests are debounced and use the trimmed title.
- Refreshing or sharing the URL restores the selected catalog state.
- Rapid search and category changes never display results from an outdated request.

**Suggested commit:** `feat: add movie search and category filters`

### 5. P0 - Load More Pagination

**Dependencies:** Search and categories

- [ ] Implement catalog queries with TanStack `useInfiniteQuery`.
- [ ] Use an explicit Load More button rather than automatic infinite scroll.
- [ ] Derive the next page from the latest TMDB page response.
- [ ] Append new results while preserving already-loaded cards.
- [ ] Disable the button and show progress while the next page is loading.
- [ ] Prevent duplicate requests from repeated clicks.
- [ ] Hide the button when the current page reaches `totalPages`.
- [ ] Keep the existing catalog visible when a next-page request fails and provide a retry action.
- [ ] Reset accumulated pages when search or category state changes.

**Definition of done**

- Consecutive clicks append the correct pages exactly once.
- Search results and each category maintain independent caches.
- No Load More control is shown after the final page.
- A failed additional-page request does not replace successful earlier pages.

**Suggested commit:** `feat: add load more pagination`

### 6. P0 - Movie Detail Page

**Dependencies:** API foundation and catalog links

- [ ] Add the dynamic route `/movies/[id]`.
- [ ] Validate the route parameter as a positive numeric movie ID.
- [ ] Prefetch the normalized detail response in the Server Component and hydrate it into TanStack Query.
- [ ] Fetch TMDB movie details with `credits` appended or combine the official details and credits endpoints server-side.
- [ ] Identify the director from the credits crew entry whose job is `Director`.
- [ ] Preserve TMDB cast order and limit the main cast to a clear, documented count such as the first 10 members.
- [ ] Display the poster, title, release year, synopsis, director, and main cast.
- [ ] Provide fallbacks for missing poster, release date, synopsis, director, cast name, character, and profile image.
- [ ] Add route-level loading, error, and not-found UI.
- [ ] Add a clear link back to the catalog without relying exclusively on browser history.
- [ ] Set useful page metadata from the movie title when detail data is available.

References:

- [TMDB movie details](https://developer.themoviedb.org/reference/movie-details)
- [TMDB movie credits](https://developer.themoviedb.org/reference/movie-credits)

**Definition of done**

- Every valid catalog card opens the matching movie detail.
- The four required PRD detail fields are visible: poster, synopsis, main cast, and director.
- Invalid IDs, unknown movies, incomplete credits, and upstream failures produce usable states.

**Suggested commit:** `feat: add movie detail page`

### 7. P0 - Submission Readiness

**Dependencies:** All previous P0 feature phases

- [ ] Replace the `create-next-app` metadata, title, description, favicon references where applicable, and starter content.
- [ ] Rewrite `README.md` with the project overview, feature list, stack, local setup, environment variables, architecture decisions, scripts, and deployment URL.
- [ ] Explain the server proxy, normalization boundary, TanStack hydration, query-key strategy, and Load More decision.
- [ ] Confirm `.env.local` and every credential-bearing file remain ignored.
- [ ] Run `npm run lint` and fix all actionable findings.
- [ ] Run `npm run build` with the required environment variable and fix all production failures.
- [ ] Deploy to Vercel and configure `TMDB_API_TOKEN` in the deployment environment.
- [ ] Smoke-test the production URL rather than relying only on local behavior.
- [ ] Verify that direct navigation and refresh work for the catalog query URL and `/movies/{id}`.
- [ ] Confirm the public GitHub repository contains no secret or generated build output.
- [ ] Review Git history for atomic, clear, descriptive commits.

**Definition of done**

- The public deployment supports every core PRD flow.
- Lint and production build pass.
- README instructions are sufficient for another developer, even though the reviewer is expected to use the deployed application.
- The public repository and live URL are ready to send by email.

**Suggested commits:**

- `docs: document setup and architecture`
- `chore: prepare production deployment`

### 8. P1 - Quality and Interview Readiness

**Dependencies:** All P0 features work

- [ ] Add automated tests for TMDB normalization helpers and error mapping.
- [ ] Test the typed query-key factory and page-reset behavior.
- [ ] Test search debounce, search/category switching, Load More, and retry interactions with mocked requests.
- [ ] Test fallbacks for missing poster, year, synopsis, director, and cast.
- [ ] Manually verify responsive behavior at representative mobile, tablet, laptop, and wide desktop widths.
- [ ] Check keyboard navigation order, visible focus, semantic headings, accessible names, and selected filter state.
- [ ] Check image sizing and cumulative layout shift on throttled loading.
- [ ] Verify 401, 404, 429, 5xx, offline, empty-result, and next-page failure behavior.
- [ ] Review Server/Client Component boundaries and avoid marking large static trees with `"use client"`.
- [ ] Remove duplicated view logic and confirm components remain understandable for interview refactoring.

**Definition of done**

- Critical data and interaction behavior has repeatable test coverage.
- Core flows remain usable without a mouse and across supported viewport sizes.
- The architecture can be explained and modified confidently during the technical interview.

**Suggested commit:** `test: cover core movie discovery flows`

### 9. P2 - Optional Polish

**Dependencies:** Every P0 acceptance check passes

- [ ] Add subtle motion that respects `prefers-reduced-motion`.
- [ ] Add richer non-essential movie metadata without crowding required information.
- [ ] Add cast profile images with the same missing-image safeguards as posters.
- [ ] Improve dynamic metadata and social previews.
- [ ] Run a final performance pass for image sizes, client JavaScript, and request waterfalls.

Do not add authentication, favorites, watchlists, trailers, genre filtering, or other unrelated product scope unless the core submission is already complete and the requirement changes explicitly.

## Public Interfaces and Data Contracts

### `MovieCategory`

```ts
type MovieCategory =
  | "now_playing"
  | "popular"
  | "top_rated"
  | "upcoming";
```

### `GET /api/movies`

Supported query parameters:

| Parameter | Required | Behavior |
| --- | --- | --- |
| `category` | No | Defaults to `popular`; accepts only `MovieCategory` values. |
| `page` | No | Defaults to `1`; must be a positive integer. |
| `query` | No | A non-empty trimmed value uses TMDB movie search and takes precedence over `category`. |

Successful response:

```ts
interface MoviePage {
  page: number;
  totalPages: number;
  results: MovieSummary[];
}
```

### `GET /api/movies/{id}`

- `id` must be a positive numeric TMDB movie ID.
- Returns a normalized `MovieDetails` object containing the required detail fields plus normalized `cast` and `director` values.
- An unknown movie returns `404`; invalid input returns `400`; upstream and configuration errors use safe error messages.

### Image Handling

- Build poster and profile URLs from TMDB file paths using an appropriate supported size.
- Restrict `next/image` to TMDB's image host and required path.
- Render a local fallback whenever the source path is null.
- Reference: [TMDB image basics](https://developer.themoviedb.org/docs/image-basics).

### TanStack Query Hydration

- Create a new server Query Client for each request and a stable browser Query Client.
- Prefetch the first catalog page and each detail page server-side.
- Dehydrate only the data needed by the route and hydrate it below the provider.
- Keep query keys identical across server prefetch and client consumption.
- Reference: [TanStack Query advanced server rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

## Final Acceptance Checklist

### Core PRD Behavior

- [ ] Movies render in a responsive card grid.
- [ ] Every card shows a poster, title, and release year or a defined fallback.
- [ ] Every card links to the correct movie detail page.
- [ ] Users can search for movies by title.
- [ ] Users can browse Now Playing, Popular, Top Rated, and Upcoming.
- [ ] Users can load additional pages with Load More.
- [ ] The detail page shows poster, synopsis, main cast, and director.

### State and Failure Handling

- [ ] Initial loading, next-page loading, empty, error, retry, and not-found states are visible and usable.
- [ ] Search, categories, and pagination never mix stale result sets.
- [ ] Missing TMDB fields do not crash rendering.
- [ ] Invalid input and TMDB 401, 404, 429, and 5xx responses are handled safely.

### Security and Delivery

- [ ] The TMDB token is not exposed in client JavaScript, browser requests, logs, or Git history.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Production smoke tests pass on mobile and desktop.
- [ ] The README contains the live deployment URL and complete setup instructions.
- [ ] The repository is public and its commit history shows incremental, atomic progress.

## Locked Decisions and Assumptions

- The backlog and repository documentation use English.
- Popular is the default category.
- Load More is used instead of automatic infinite scroll or numbered pagination.
- UI copy and TMDB requests default to English.
- Search input is debounced by 350 ms.
- A non-empty search replaces category results; selecting a category clears the search.
- The TMDB token remains server-side behind Next.js Route Handlers.
- Automated tests are P1; functional P0 behavior, production build, and deployment take precedence.
