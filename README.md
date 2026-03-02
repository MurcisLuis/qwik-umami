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

Component that loads the Umami tracking script. Checks service availability before loading and handles errors gracefully.

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
  UmamiServerOptions, // { websiteId, hostUrl, userAgent? }
  UmamiServerPayload, // Server-side payload shape
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

## How it works

1. `<UmamiScript>` uses Qwik's `useVisibleTask$` to load the tracker script client-side only
2. Before injecting the `<script>`, it sends a HEAD request to verify Umami is reachable (3s timeout)
3. If the service is down or blocked, it fails silently — no errors, no broken pages
4. `umamiTrack()` and `umamiIdentify()` check for `window.umami` before calling — safe everywhere
5. `serverUmamiTrack()` and `serverUmamiIdentify()` POST directly to the Umami `/api/send` endpoint — no browser required

## License

MIT
