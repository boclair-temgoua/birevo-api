export const removeDuplicates = <T>(list: T[]): T[] => {
    return [...new Set(list)];
};
