export interface UmamiConfig {
  websiteId: string;
  src?: string;
  hostUrl?: string;
  autoTrack?: boolean;
  domains?: string;
  dataDomains?: string;
}

export type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: UmamiEventData) => void;
    };
  }
}
