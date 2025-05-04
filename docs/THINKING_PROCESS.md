# Thought Process & Approach

This document outlines my approach to tackling this coding challenge. It covers the initial research, goal setting, key decisions, and reflections made throughout the process. My aim is to provide transparency into how I work and problem-solve, offering insight into both my technical methods and my perspective as a developer.

## Initial Research & Context Gathering

Before diving into the code, I gathered broader context about Vizzuality:

- **GitHub Exploration:** I reviewed the [Vizzuality GitHub Organization](https://github.com/Vizzuality) to understand common technologies, project structures.
- **Discovering Resources:** This exploration led me to useful internal documentation and resources, including:
  - The [Front-end Scaffold Docs](https://front-end-scaffold-docs.vercel.app/)
  - Insights from [Devismos](https://vizzuality.github.io/devismos/docs/frontismos/strategy-2021/initiatives-directory/hiring-proposal/) regarding development strategy.
  - The detailed [Frontend Engineer Role Description (Google Doc)](https://docs.google.com/document/d/1uVeHYs6wOqRqQriZE7Y68JCNycXokVJX3K9y7d5t8mQ/edit?tab=t.0#heading=h.ql8npoan2zxg), which provided valuable specifics.

---

## Used Libraries

- **next** (14.2.28)
- **react** (18)
- **react-dom** (18)
- **typescript** (5)

### Mapping

- **maplibre-gl** (5.4.0)
- **@vis.gl/react-maplibre** (8.0.4)
- **@turf/turf** (7.2.0)

### UI Components - from Shadcn

- **@radix-ui/react-select** (2.2.2)
- **@radix-ui/react-slot** (1.2.0)
- **lucide-react** (0.503.0)

### Styling

- **tailwindcss** (3.4.17)
- **tailwind-merge** (3.2.0)
- **clsx** (2.1.1)
- **class-variance-authority** (0.7.1)

### State Management

- **@tanstack/react-query** (5.74.7)

### PWA

- **next-pwa** (5.6.0)

### Utilities

- **lodash.debounce** (4.0.8)

### LLms

- **Claude Sonnet** (3.7)
- **Google Gemini** (2.5 Pro Preview)

---

## Working Journal

- All features are developed into separate branches with specific naming and so.

In the end, the project description was right, there is **no correct way** of doing the assignment.
Before starting I had in mind some architectural strategies:

- A layout with a common map since the composition was similar but that required some way to share the state
- I could do that with URL params or a state management, but the latter one would have added some complexity to the project
- The thing is that I wanted to keep it simple and not bloat it with libraries

The other way around was having **separate map components** that will allow a greater flexibility, that's what I preferred in the end.

### Data Fetching

Regarding the data fetching, I think I could do it with more server components but I am not so skilled in that matter,
so I chose **Tanstack Query** for client data fetching combining with some server components where it was possible.

Why not another library? I wanted to test new things, this project was also about me learning new stuff in a greenfield env.

### Technology Stack

Now talking about learning, the first instinct was using:

- Next.js 15
- React 19
- Tailwind 4

But that turned out pretty bad. I had some problems with library compatibilities, so I downgraded to:

- React 18 (plus this way I wanted to show that I know stuff about `useMemo` and `useCallback`)
- Tailwind 3 (after messing with the config for v4 I downgraded as well, didn't have enough time)
- Next.js 14

Next 15 turned to have some problems with page loading, this might be as well a skill issue on my side but after fearing bad performance I downgraded to 14,
this is not a good practice keeping in mind that the best thing about constant updates are the security patches, I remember [this Next.js vulnerability](https://strobes.co/blog/understanding-next-js-vulnerability/) being a big thing.

### Routing Structure

The Home page is just a redirect to `/networks` because I felt like it's more clean to leave space for extensibility.

- Main view: `/networks`
- Detail view: `/networks/[id]`

## Main View Features

Besides completing the required points, for optimizing loading times on navigation to detail view:

- I've added a **prefetch on hover** over the DetailButton
- I think I could have gone an extra step to see if I can prefetch the map tiles. However, I'm afraid that for the moment at least I don't have that much experience to make it work and I would not be able to properly explain it
- I've tried to add prefetch on hover over the map Markers, but that would make to many requests, at lest in the current set-up

I also added a **PWA functionality** to generate service workers that should handle some level of caching.
This is not necessarily since I could add some workers by myself but I wanted to show that I know that PWA exists.

The state is shared in the URL, so both Map component and the View are in sync.

### API Optimization

Regarding pagination and search on the server, it seems like the [API doesn't support that](https://github.com/eskerda/citybikes-api/blob/master/api/views.py) so I made a client side pagination, and in order to optimize the load, I've made the fetch to filter only for:

- `id`
- `name`
- `company`
- `location`

This reduced the load from **62.9 kb → 45.1 kb** after filtering the networks by needed fields.

There is also some level of loading state fallback for List items, as considering it a good practice, design wise it's not the best looking one but I've tried to do it.

The Map adapts its zoom level accordingly to the viewport, thanks to `useSyncExternalStore`.

### Bonus Features

The other Bonus functionality, **"Near me"** was very fun to do:

- Besides centering the map and showing the nearby networks, it calls itself on 10, 50, 100 and 200 km to check
- When finding the first results it puts a circle with the radius of searchingArea
- If I had more time I would have made it dynamically to have a slider or similar element to be able to programmatically search networks on a different radius

The Pagination used is based on the **Shadcn** one. However, it doesn't do a full reload on next, it's working as a client pagination since a full reload benefits the server components, in my case it would trigger unnecessarily refreshes.


### PageMapLayout

```tsx
<PageMapLayout>
  <Sidebar />
  <Map />
</PageMapLayout>
```

A responsive two-column layout component for map applications. While currently desktop-focused, I'd invest in mobile optimization in a real-world scenario.

For mobile, I'd implement something similar to Bolt's main screen - map on top, NetworkDetails below as a draggable component using Shadcn's `<Drawer>` with snap points functionality.

Reference: [Vaul Snap Points](https://vaul.emilkowal.ski/snap-points)

### NetworkListMap

```tsx
<NetworkListMap />
```

The Map component responsible for displaying the network list. All networks currently render in a single Layer component, but with more data, clustering would improve performance.

Alternative strategies could include:
- Showing only closest networks based on user location
- Using IP geolocation services for initial viewport selection

Initially, I used React components for interactions, but performance issues led me to direct map manipulation:

```ts
const map = mapRef.current?.getMap();
```

The component would benefit from:
- Better separation into custom hooks
- Enhanced loading states that account for map asset rendering
- More granular error handling


# Detail View Features

Beyond the required objectives, the following enhancements were implemented:

## Station Pagination

Client-side pagination follows the same pattern as network pagination. Sorting is managed through the `<StationListHeader />` component using URL state management with these interfaces:

```ts
export type StationSortKey = 'free_bikes' | 'empty_slots';
export type SortDirection = 'asc' | 'desc';
```

The Station List View includes a basic loading state via `StationListItem`. Error scenarios using `isError` could be further developed.

The back button provides a simple redirect to `/networks` without preserving MainView state (including pagination history), which would require additional development.

## NetworkDetailMap

The `<NetworkDetailMap />` component follows similar patterns to `<NetworkListMap />`, particularly in interaction handling.

Upon rendering, it calculates bounding points and displays the map optimally zoomed to the network's stations without unnecessary animations.

Some components would benefit from refactoring, such as the popup HTML structure:

```tsx
const html = `
  <div class="p-4 flex flex-col gap-2">
```

The hover/click interactions for markers need refinement.

## Data Flow

```tsx
<NetworkDetailView
  networkId={id}
  selectedStationId={selectedStationId}
/>
<NetworkDetailMap
  networkId={id}
  onSelectStation={setSelectedStationId}
/>
```

I considered storing `selectedStationId` in the URL but opted for state lifting to avoid bloating the browser history during frequent hover interactions.


# Unfilled Points

I couldn't implement the animation of the left layout column, specifically the slide in-out transition for NetworkList and NetworkDetail components on route changes.
The hover/click over the Markers in the `NetworkDetailMap` are not as fluid as desired.

