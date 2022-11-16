import { TRPCClientErrorLike, type TRPCClientError } from '@trpc/client';
import { type AppRouter } from '@server/trpc/router/_app';
import { type NextApiResponse } from 'next/types';

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

export const handleError = async (err: TRPCClientError<AppRouter> | TRPCClientErrorLike<AppRouter>) => {
    let message: string;
    if (err instanceof Object) {
        const parsedError = JSON.parse(err.message);
        message = parsedError[0].message ?? 'Something went wrong!';
    }
    else {
        message = 'Something went wrong!';
    }
    return message;
};

export const formatDate = (date: Date | null) => {
    return date ? Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(date)) : 'Sometime Ago'
}


/**
 * Helper for getting the user's session. Only used internally.
 * @example const session = await getSession(opts.req)
 */

