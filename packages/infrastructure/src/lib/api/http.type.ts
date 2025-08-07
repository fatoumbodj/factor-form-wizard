export type HttpParams = {
    baseURL: string;
    token: string | null;
    onUnauthorized: () => void | null
}