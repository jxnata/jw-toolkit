export const normalizeUsername = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s/g, '')
        .toLowerCase();
}