import type { UmamiEventData, UmamiServerOptions, UmamiServerPayload } from '../types';

const UMAMI_VERSION = '2.0.0';
const DEFAULT_USER_AGENT = `Mozilla/5.0 (compatible; qwik-umami/${UMAMI_VERSION})`;

async function send(
  options: UmamiServerOptions,
  payload: UmamiServerPayload,
  type: 'event' | 'identify' = 'event',
): Promise<Response> {
  const { hostUrl, websiteId, userAgent = DEFAULT_USER_AGENT } = options;

  return fetch(`${hostUrl}/api/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    },
    body: JSON.stringify({
      type,
      payload: { website: websiteId, ...payload },
    }),
  });
}

export async function serverUmamiTrack(
  options: UmamiServerOptions,
  event: string | UmamiServerPayload,
  data?: UmamiEventData,
): Promise<Response> {
  if (typeof event === 'string') {
    return send(options, { name: event, data });
  }
  return send(options, event);
}

export async function serverUmamiIdentify(
  options: UmamiServerOptions,
  data: UmamiEventData,
): Promise<Response> {
  return send(options, { data }, 'identify');
}
