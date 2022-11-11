import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export const loadZxcvbn = async (): Promise<{}> => {

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

export const handleError = async (err: any) => {
    if (err instanceof TRPCClientError) {
        switch (err.message) {
            case 'UNAUTHORIZED':
                return 'You are not authorized to perform this action.';
                break;
            case 'BAD_REQUEST':
                return 'Invalid username or password.';
                break;
            default:
                return 'An unknown error has occurred.';
                break;
        }
    } else {
        console.log(err)
        return 'Something went wrong.'
    }
}


export type TypeMutationResponseData = {
    data: JSON,
    message: string,
    statusCode: number
}