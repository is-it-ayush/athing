import { type TRPCClientError } from '@trpc/client';
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