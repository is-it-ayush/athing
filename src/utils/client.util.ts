
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