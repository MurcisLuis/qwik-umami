import type { UmamiEventData, UmamiPayload } from '../types';

export function umamiTrack(): void;
export function umamiTrack(payload: UmamiPayload): void;
export function umamiTrack(eventName: string): void;
export function umamiTrack(eventName: string, data: UmamiEventData): void;
export function umamiTrack(
  eventNameOrPayload?: string | UmamiPayload,
  data?: UmamiEventData,
): void {
  if (typeof window === 'undefined') return;

  try {
    if (window.umami?.track) {
      if (eventNameOrPayload === undefined) {
        window.umami.track();
      } else if (typeof eventNameOrPayload === 'string') {
        window.umami.track(eventNameOrPayload, data!);
      } else {
        window.umami.track(eventNameOrPayload);
      }
    } else if (import.meta.env.DEV) {
      console.warn('[qwik-umami] Tracking unavailable');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[qwik-umami] Error sending event:', eventNameOrPayload, error);
    }
  }
}

export function umamiIdentify(data: UmamiEventData): void;
export function umamiIdentify(uniqueId: string): void;
export function umamiIdentify(uniqueId: string, data: UmamiEventData): void;
export function umamiIdentify(
  uniqueIdOrData: string | UmamiEventData,
  data?: UmamiEventData,
): void {
  if (typeof window === 'undefined') return;

  try {
    if (window.umami?.identify) {
      if (typeof uniqueIdOrData === 'string') {
        window.umami.identify(uniqueIdOrData, data!);
      } else {
        window.umami.identify(uniqueIdOrData);
      }
    } else if (import.meta.env.DEV) {
      console.warn('[qwik-umami] Identify unavailable');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[qwik-umami] Error identifying:', error);
    }
  }
}
