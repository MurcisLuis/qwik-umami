import type { UmamiEventData } from '../types';

export const useUmamiTrack = () => {
  const track = (eventName: string, eventData?: UmamiEventData) => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (window.umami?.track) {
        window.umami.track(eventName, eventData);
      } else {
        if (import.meta.env.DEV) {
          console.warn('[qwik-umami] Tracking unavailable for event:', eventName);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[qwik-umami] Error sending event:', eventName, error);
      }
    }
  };

  return { track };
};
