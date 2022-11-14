import { type TRPCClientError } from '@trpc/client';
import { type AppRouter } from '@server/trpc/router/_app';
import {  type NextApiResponse } from 'next/types';
import LRU from 'lru-cache';
import { type RateLimitOptions } from '@utils/client.typing';


export const loadZxcvbn = async () => {

    const common = await import('@zxcvbn-ts/language-common');
    const translations = await import('@zxcvbn-ts/language-en');

    return {
        dictionary: {
            ...common.default.dictionary,
            ...translations.default.dictionary
        },
        graphs: {
            ...common.default.adjacencyGraphs,
        },
        translations: translations.default.translations
    };
};

export const handleError = async (err: TRPCClientError<AppRouter>) => {
    let message: string;
    switch (err.message) {
        case 'UNAUTHORIZED':
            message = 'You are not authorized to perform this action.';
            break;
        case 'BAD_REQUEST':
            message = 'Invalid username or password.';
            break;
        default:
            if (err instanceof Array) {
                const parsedError = JSON.parse(err.message);
                message = parsedError[0].message ?? 'Something went wrong!';
            }
            else {
                message = 'Something went wrong!';
            }
            break;
    }
    return message;
};

// Simple Rate Limiter from LRU Cache
export default function rateLimit(options?: RateLimitOptions) {
    const tokenCache = new LRU({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    })

    return {
        check: (res: NextApiResponse, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0]
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount)
                }
                tokenCount[0] += 1

                const currentUsage = tokenCount[0] as number;
                const isRateLimited = currentUsage >= limit
                res.setHeader('X-RateLimit-Limit', limit)
                res.setHeader(
                    'X-RateLimit-Remaining',
                    isRateLimited ? 0 : limit - currentUsage
                )

                return isRateLimited ? reject() : resolve()
            }),
    }
}


/**
 * Helper for getting the user's session. Only used internally.
 * @example const session = await getSession(opts.req)
 */

