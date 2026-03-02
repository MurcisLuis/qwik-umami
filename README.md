# qwik-umami

Umami Analytics integration for [Qwik](https://qwik.dev). Lightweight, privacy-focused, and SSR-safe.

## Installation

```bash
npm install qwik-umami
# or
bun add qwik-umami
# or
pnpm add qwik-umami
```

## Usage

### Add the tracking script

Add `UmamiScript` to your root layout or `root.tsx`:

```tsx
import { UmamiScript } from 'qwik-umami';

export default component$(() => {
  return (
    <html>
      <head>
        <UmamiScript websiteId="your-website-id" />
      </head>
      <body>
        <Slot />
      </body>
    </html>
  );
});
```

### Track custom events

Use the `useUmamiTrack` hook in any component:

```tsx
import { component$ } from '@builder.io/qwik';
import { useUmamiTrack } from 'qwik-umami';

export const MyComponent = component$(() => {
  const { track } = useUmamiTrack();

  return (
    <button onClick$={() => track('button-click', { label: 'cta' })}>
      Click me
    </button>
  );
});
```

## API

### `<UmamiScript>`

Component that loads the Umami tracking script. It checks service availability before loading and handles errors gracefully.

| Prop          | Type      | Default                                | Description                       |
| ------------- | --------- | -------------------------------------- | --------------------------------- |
| `websiteId`   | `string`  | *required*                             | Your Umami website ID             |
| `src`         | `string`  | `https://cloud.umami.is/script.js`     | URL of the Umami tracking script  |
| `hostUrl`     | `string`  | —                                      | Custom host URL for self-hosted   |
| `autoTrack`   | `boolean` | `true`                                 | Enable automatic page tracking    |
| `domains`     | `string`  | —                                      | Comma-separated allowed domains   |
| `dataDomains` | `string`  | —                                      | Comma-separated data domains      |

### `useUmamiTrack()`

Returns an object with a `track` function for sending custom events.

```ts
const { track } = useUmamiTrack();
track('event-name', { key: 'value' });
```

- SSR-safe: no-op on the server
- Silent in production, logs warnings in development
- Gracefully handles cases where Umami is not loaded

## Self-hosted Umami

```tsx
<UmamiScript
  websiteId="your-website-id"
  src="https://your-umami-instance.com/script.js"
  hostUrl="https://your-umami-instance.com"
/>
```

## License

MIT
