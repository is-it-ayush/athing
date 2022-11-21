import type { TRPCClientErrorLike, TRPCClientError } from '@trpc/client';
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

export const handleError = async (err: TRPCClientError<AppRouter>) => {
    console.log(err.message);
    return 'Something went wrong!'
};

export const formatDate = (date: Date | null, type?: string) => {

    let options: Intl.DateTimeFormatOptions;

    switch (type) {
        case 'includeTime':
            options = { year: '2-digit', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
            break;
        case 'dateAndTime':
            options = { month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
            break;
        default:
            options = { year: '2-digit', month: 'short', day: '2-digit' };
            break;
    }


    return date ? Intl.DateTimeFormat('en-US', options).format(new Date(date)) : 'Sometime Ago'
}

export const ComponentAnimations = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
    transitions: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
    },
};

export const trpcErrorHandler = (err: TRPCClientError<AppRouter> | TRPCClientErrorLike<AppRouter>) => {
    if (err.data?.code === 'INTERNAL_SERVER_ERROR') {
        return 'Something went wrong!';
    }
    return err.message;
};


/**
 * Helper for getting the user's session. Only used internally.
 * @example const session = await getSession(opts.req)
 */

