import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { ZodError } from 'zod';

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
                try {
                    let parsedError = JSON.parse(err.message);
                    return parsedError[0].message ?? 'An unknown error occurred.';
                }
                catch (err: any) {
                    return 'An unknown error occurred.';
                }
                break;
        }
    } else {
        return 'Something went wrong.'
    }
}


export type TypeMutationResponseData = {
    data: JSON,
    message: string,
    statusCode: number
}