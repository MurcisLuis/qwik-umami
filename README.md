# qwik-umami

[![npm version](https://img.shields.io/npm/v/qwik-umami.svg)](https://www.npmjs.com/package/qwik-umami)
[![license](https://img.shields.io/npm/l/qwik-umami.svg)](https://github.com/murcisluis/qwik-umami/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/qwik-umami)](https://bundlephobia.com/package/qwik-umami)

SSR-safe [Umami Analytics](https://umami.is) integration for [Qwik](https://qwik.dev). Drop-in component + utility functions for automatic page views, custom event tracking, and server-side analytics.

- **Zero config** — one component in `root.tsx` and you're tracking
- **SSR-safe** — no-ops on the server, hydrates on the client
- **Server-side tracking** — send events from `routeLoader$`, `routeAction$`, or `server$`
- **Self-hosted ready** — works with Umami Cloud and self-hosted instances
- **Typed** — full TypeScript support, typed against the official Umami API
- **Lightweight** — no runtime dependencies, just Qwik as peer dep

## Installation

```bash
bun add qwik-umami
# or
npm install qwik-umami
# or
pnpm add qwik-umami
```

## Quick start

### 1. Add the script to your root layout

```tsx
// src/root.tsx
import { UmamiScript } from 'qwik-umami';

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <UmamiScript websiteId="your-website-id" />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
```

That's it. Page views are tracked automatically.

### 2. Track custom events (client-side)

```tsx
import { component$ } from '@builder.io/qwik';
import { umamiTrack } from 'qwik-umami';

export const SignupButton = component$(() => {
  return (
    <button onClick$={() => umamiTrack('signup-click', { plan: 'pro' })}>
      Start free trial
    </button>
  );
});
```

### 3. Track events server-side

Use `serverUmamiTrack` inside `routeLoader$`, `routeAction$`, or `server$`:

```tsx
import { routeAction$ } from '@builder.io/qwik-city';
import { serverUmamiTrack } from 'qwik-umami/server';

const options = {
  websiteId: import.meta.env.UMAMI_WEBSITE_ID,
  hostUrl: import.meta.env.UMAMI_HOST_URL,
};

export const useCheckout = routeAction$(async (data) => {
  await serverUmamiTrack(options, 'purchase', { plan: data.plan });
  // ...
});
```

## API

### `<UmamiScript>`

Component that loads the Umami tracking script. Uses `useTask$` with `isServer` guard to preserve Qwik's resumability model. Loads via `requestIdleCallback` by default to avoid blocking the main thread.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `websiteId` | `string` | **required** | Your Umami website ID |
| `src` | `string` | `https://cloud.umami.is/script.js` | URL of the tracking script |
| `hostUrl` | `string` | — | Custom host URL for data collection |
| `autoTrack` | `boolean` | `true` | Enable automatic page view tracking |
| `domains` | `string` | — | Comma-separated list of allowed domains |
| `tag` | `string` | — | Assign events to a specific tag |
| `excludeSearch` | `boolean` | — | Exclude URL search parameters from tracking |
| `excludeHash` | `boolean` | — | Exclude URL hash fragments from tracking |
| `doNotTrack` | `boolean` | — | Respect the browser's Do Not Track setting |
| `strategy` | `'eager' \| 'idle'` | `'idle'` | `'idle'` defers loading via `requestIdleCallback`, `'eager'` loads immediately |

---

### `umamiTrack()`

Client-side utility function. SSR-safe (no-op on server). Import from `'qwik-umami'`.

```ts
// Track a pageview manually
umamiTrack();

// Track a named event
umamiTrack('button-click');

// Track an event with data
umamiTrack('purchase', { plan: 'pro', price: 29 });

// Track with a full custom payload
umamiTrack({ website: 'id', url: '/checkout', title: 'Checkout' });
```

---

### `umamiIdentify()`

Associates the current session with a user or custom data. Client-side only. Import from `'qwik-umami'`.

```ts
// Identify with session data only
umamiIdentify({ plan: 'pro', role: 'admin' });

// Identify with a unique ID
umamiIdentify('user-123');

// Identify with a unique ID and data
umamiIdentify('user-123', { plan: 'pro' });
```

---

### `serverUmamiTrack()`

Server-side event tracking. Works in `routeLoader$`, `routeAction$`, `server$`. Import from `'qwik-umami/server'`.

```ts
import { serverUmamiTrack } from 'qwik-umami/server';
import type { UmamiServerOptions } from 'qwik-umami/server';

const options: UmamiServerOptions = {
  websiteId: 'your-website-id',
  hostUrl: 'https://your-umami-instance.com', // or https://cloud.umami.is
};

// Track a named event
await serverUmamiTrack(options, 'signup');

// Track with data
await serverUmamiTrack(options, 'purchase', { plan: 'pro', amount: 29 });

// Track with full payload
await serverUmamiTrack(options, {
  url: '/checkout',
  title: 'Checkout',
  name: 'page-view',
});
```

---

### `createUmamiPlugin()`

Server-side Qwik City plugin for automatic page view tracking. Tracks every page request via the Umami API without requiring the client-side script. Import from `'qwik-umami/server'`. Requires `@builder.io/qwik-city` as peer dependency.

```ts
// src/routes/plugin@umami.ts
import { createUmamiPlugin } from 'qwik-umami/server';

export const onRequest = createUmamiPlugin({
  websiteId: import.meta.env.PUBLIC_UMAMI_ID,
  hostUrl: import.meta.env.UMAMI_HOST_URL,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `websiteId` | `string` | **required** | Your Umami website ID |
| `hostUrl` | `string` | **required** | Umami instance URL |
| `userAgent` | `string` | request UA | Custom user-agent for tracking requests |
| `filter` | `(url: URL, headers: Headers) => boolean` | — | Return `false` to skip tracking for specific routes |

**How it works:**
- Only tracks `GET` requests (skips POST, PUT, DELETE, etc.)
- Automatically ignores static assets (`.js`, `.css`, `.png`, `.ico`, etc.)
- Fire-and-forget — the tracking request does NOT block the response
- Extracts `referrer`, `language`, and `user-agent` from request headers

**Filter example:**

```ts
export const onRequest = createUmamiPlugin({
  websiteId: 'your-id',
  hostUrl: 'https://your-umami.com',
  filter: (url) => !url.pathname.startsWith('/api/'),
});
```

---

### `serverUmamiIdentify()`

Server-side session identification. Import from `'qwik-umami/server'`.

```ts
import { serverUmamiIdentify } from 'qwik-umami/server';

await serverUmamiIdentify(options, { userId: 'abc', plan: 'pro' });
```

---

### Types

```ts
import type {
  UmamiConfig,        // Props for <UmamiScript>
  UmamiEventData,     // Record<string, string | number | boolean>
  UmamiPayload,       // Full browser tracker payload
} from 'qwik-umami';

import type {
  UmamiServerOptions,  // { websiteId, hostUrl, userAgent? }
  UmamiServerPayload,  // Server-side payload shape
  UmamiPluginOptions,  // { websiteId, hostUrl, userAgent?, filter? }
} from 'qwik-umami/server';
```

## Real-world example

```tsx
// Tracking a full auth + conversion funnel

// Landing page CTA (client)
<button onClick$={() => umamiTrack('cta-click', { location: 'hero' })}>
  Get started
</button>

// Auth action (server)
export const useLogin = routeAction$(async (data) => {
  const user = await loginUser(data);
  await serverUmamiTrack(options, 'login', { success: true });
  return user;
});

// Identify after login (client)
umamiIdentify(user.id, { plan: user.plan });
```

## Self-hosted Umami

```tsx
<UmamiScript
  websiteId="your-website-id"
  src="https://your-umami-instance.com/script.js"
/>
```

```ts
const options = {
  websiteId: 'your-website-id',
  hostUrl: 'https://your-umami-instance.com',
};
```

## Which approach should I use?

| Approach | Best for |
| --- | --- |
| **`<UmamiScript>` only** | Most apps — full browser data (screen size, timezone, JS events) |
| **`createUmamiPlugin` only** | Server-rendered sites, bot tracking, ad-blocker resilience |
| **Both together** | Maximum coverage — use plugin for page views + component for events |

**Using both together:**

```tsx
// src/routes/plugin@umami.ts — handles page views server-side
import { createUmamiPlugin } from 'qwik-umami/server';

export const onRequest = createUmamiPlugin({
  websiteId: import.meta.env.PUBLIC_UMAMI_ID,
  hostUrl: import.meta.env.UMAMI_HOST_URL,
});
```

```tsx
// src/root.tsx — handles custom events client-side (autoTrack disabled to avoid duplicate page views)
<UmamiScript websiteId="your-website-id" autoTrack={false} />
```

## How it works

1. `<UmamiScript>` uses Qwik's `useTask$` with an `isServer` guard — preserves resumability (no eager JS download)
2. By default, the script loads via `requestIdleCallback` to avoid blocking the main thread
3. If the script fails to load (blocked by ad blocker, network error), it fails silently and cleans up
4. `umamiTrack()` and `umamiIdentify()` check for `window.umami` before calling — safe everywhere
5. `serverUmamiTrack()` and `serverUmamiIdentify()` POST directly to the Umami `/api/send` endpoint — no browser required
6. `createUmamiPlugin()` intercepts every GET request at the middleware level and sends a page view to Umami — fire-and-forget, never blocks the response

## License

MIT
