import type { RequestHandler } from '@builder.io/qwik-city';
import type { UmamiPluginOptions } from '../types';
import { serverUmamiTrack } from './umami-server';

const IGNORED_EXTENSIONS =
  /\.(js|css|ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|map|json)$/;

export function createUmamiPlugin(options: UmamiPluginOptions): RequestHandler {
  return async ({ url, headers, method }) => {
    if (method !== 'GET') return;
    if (IGNORED_EXTENSIONS.test(url.pathname)) return;

    if (options.filter && !options.filter(url, headers)) return;

    const language = headers.get('accept-language')?.split(',')[0];
    const referrer = headers.get('referer') || undefined;
    const userAgent = headers.get('user-agent') || undefined;

    serverUmamiTrack(
      {
        websiteId: options.websiteId,
        hostUrl: options.hostUrl,
        userAgent: userAgent || options.userAgent,
      },
      {
        url: url.pathname + url.search,
        referrer,
        language: language || undefined,
      },
    ).catch(() => {});
  };
}
