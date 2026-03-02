# qwik-umami

[![npm version](https://img.shields.io/npm/v/qwik-umami.svg)](https://www.npmjs.com/package/qwik-umami)
[![license](https://img.shields.io/npm/l/qwik-umami.svg)](https://github.com/murcisluis/qwik-umami/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/qwik-umami)](https://bundlephobia.com/package/qwik-umami)

SSR-safe [Umami Analytics](https://umami.is) integration for [Qwik](https://qwik.dev). Drop-in component + hook for automatic page views and custom event tracking.

- **Zero config** — one component in `root.tsx` and you're tracking
- **SSR-safe** — no-ops on the server, hydrates on the client
- **Self-hosted ready** — works with Umami Cloud and self-hosted instances
- **Typed** — full TypeScript support with exported types
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

### 2. Track custom events

Use the `useUmamiTrack` hook in any component:

```tsx
import { component$ } from '@builder.io/qwik';
import { useUmamiTrack } from 'qwik-umami';

export const SignupButton = component$(() => {
  const { track } = useUmamiTrack();

  return (
    <button onClick$={() => track('signup-click', { plan: 'pro' })}>
      Start free trial
    </button>
  );
});
```

### Self-hosted Umami

```tsx
<UmamiScript
  websiteId="your-website-id"
  src="https://your-umami-instance.com/script.js"
/>
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
| `domains` | `string` | — | Comma-separated allowed domains |
| `dataDomains` | `string` | — | Comma-separated data domains |

### `useUmamiTrack()`

Hook that returns a `track` function for sending custom events.

```ts
const { track } = useUmamiTrack();

// Simple event
track('button-click');

// Event with data
track('purchase', { product: 'plan-pro', price: 29 });
```

**Behavior:**
- SSR-safe: no-op on the server, works after hydration
- Silent in production, logs warnings in development if Umami isn't loaded
- Gracefully handles ad blockers and network failures — no errors, no broken pages

### Types

```ts
import type { UmamiConfig, UmamiEventData } from 'qwik-umami';

// UmamiConfig — props for <UmamiScript>
// UmamiEventData — Record<string, string | number | boolean>
```

## Real-world example

Tracking a full auth + conversion funnel:

```tsx
// Landing page CTA
track('cta-click', { location: 'hero', label: 'get-started' });

// Auth events
track('login', { success: true });
track('register', { success: true });

// App events
track('project-create');
track('project-open', { status: 'ACTIVE' });
track('chat-message-sent', { hasAttachments: false });
```

## How it works

1. `<UmamiScript>` uses Qwik's `useVisibleTask$` to load the tracker script client-side only
2. Before injecting the `<script>`, it sends a HEAD request to verify the Umami service is reachable (3s timeout)
3. If the service is down or blocked, it fails silently — no errors, no broken pages
4. `useUmamiTrack()` checks for `window.umami` before calling `track()` — safe everywhere

## License

MIT
