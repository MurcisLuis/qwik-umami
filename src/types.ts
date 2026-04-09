export interface UmamiConfig {
  websiteId: string;
  src?: string;
  hostUrl?: string;
  autoTrack?: boolean;
  domains?: string;
  tag?: string;
  excludeSearch?: boolean;
  excludeHash?: boolean;
  doNotTrack?: boolean;
  strategy?: 'eager' | 'idle';
}

export type UmamiEventData = Record<string, string | number | boolean>;

export type UmamiPayload = {
  website: string;
  url?: string;
  referrer?: string;
  title?: string;
  hostname?: string;
  language?: string;
  screen?: string;
  [key: string]: unknown;
};

// Server-side types
export interface UmamiServerOptions {
  websiteId: string;
  hostUrl: string;
  userAgent?: string;
}

export interface UmamiServerPayload {
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  name?: string;
  data?: UmamiEventData;
}

export interface UmamiPluginOptions {
  websiteId: string;
  hostUrl: string;
  userAgent?: string;
  filter?: (url: URL, headers: Headers) => boolean;
}

export interface UmamiTracker {
  track(): void;
  track(payload: UmamiPayload): void;
  track(eventName: string): void;
  track(eventName: string, data: UmamiEventData): void;
  identify(data: UmamiEventData): void;
  identify(uniqueId: string): void;
  identify(uniqueId: string, data: UmamiEventData): void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
