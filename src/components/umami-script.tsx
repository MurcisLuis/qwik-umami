import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { UmamiConfig } from '../types';

export const UmamiScript = component$<UmamiConfig>(
  ({
    websiteId,
    src = 'https://cloud.umami.is/script.js',
    hostUrl,
    autoTrack = true,
    domains,
    tag,
    excludeSearch,
    excludeHash,
    doNotTrack,
    strategy = 'idle',
  }) => {
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      if (document.querySelector(`script[data-website-id="${websiteId}"]`)) {
        return;
      }

      let script: HTMLScriptElement | null = null;

      const loadScript = () => {
        script = document.createElement('script');
        script.defer = true;
        script.src = src;
        script.setAttribute('data-website-id', websiteId);

        if (hostUrl) {
          script.setAttribute('data-host-url', hostUrl);
        }

        if (!autoTrack) {
          script.setAttribute('data-auto-track', 'false');
        }

        if (domains) {
          script.setAttribute('data-domains', domains);
        }

        if (tag) {
          script.setAttribute('data-tag', tag);
        }

        if (excludeSearch) {
          script.setAttribute('data-exclude-search', 'true');
        }

        if (excludeHash) {
          script.setAttribute('data-exclude-hash', 'true');
        }

        if (doNotTrack) {
          script.setAttribute('data-do-not-track', 'true');
        }

        script.onerror = () => {
          if (import.meta.env.DEV) {
            console.warn('[qwik-umami] Failed to load script');
          }
          script?.remove();
          script = null;
        };

        if (import.meta.env.DEV) {
          script.onload = () => {
            console.log('[qwik-umami] Script loaded successfully');
          };
        }

        document.head.appendChild(script);
      };

      if (strategy === 'eager') {
        loadScript();
      } else {
        if ('requestIdleCallback' in window) {
          const id = window.requestIdleCallback(loadScript);
          cleanup(() => {
            window.cancelIdleCallback(id);
            script?.remove();
          });
          return;
        }
        const timeoutId = setTimeout(loadScript, 0);
        cleanup(() => {
          clearTimeout(timeoutId);
          script?.remove();
        });
        return;
      }

      cleanup(() => {
        script?.remove();
      });
    });

    return null;
  },
);
