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
  }) => {
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      if (document.querySelector(`script[data-website-id="${websiteId}"]`)) {
        return;
      }

      const checkAndLoadScript = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          await fetch(src, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          loadUmamiScript();
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn(
              '[qwik-umami] Service unavailable, tracking temporarily disabled',
              error,
            );
          }
        }
      };

      const loadUmamiScript = () => {
        try {
          const script = document.createElement('script');
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
            script.remove();
          };

          script.onload = () => {
            if (import.meta.env.DEV) {
              console.log('[qwik-umami] Script loaded successfully');
            }
          };

          document.head.appendChild(script);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('[qwik-umami] Initialization error:', error);
          }
        }
      };

      checkAndLoadScript();
    });

    return null;
  },
);
