import { TRPCClientErrorLike, TRPCClientError } from '@trpc/client';
import { type AppRouter } from '@server/trpc/router/_app';

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
    // --todo-- add a better error handling system
    return 'Something went wrong!'
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

