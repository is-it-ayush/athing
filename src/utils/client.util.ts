import { TRPCClientError } from '@trpc/client';


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

export const handleError = async (err: any): Promise<string> => {
    let message: string;
    if (err instanceof TRPCClientError) {

        try {
            const parsed = JSON.parse(err.shape.message);
            message = parsed[0].message;
        }
        catch {
            message = err.shape.message;
        }
    }
    else {
        message = 'An Error Occurred.';
    }
    return message;
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

export const formatNumber = (number: number) => {
    return Intl.NumberFormat('en-US', { maximumSignificantDigits: 3, notation: "compact" }).format(number);
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


/**
 * Helper for getting the user's session. Only used internally.
 * @example const session = await getSession(opts.req)
 */

