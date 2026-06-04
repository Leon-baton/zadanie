export interface ICurrentUserPayload {
    sub: string;
    email: string;
    tokenVersion: number;
}

export interface ICacheableOptions {
    keyPrefix: string;
    ttl?: number;
    keyGenerator?: (...args: any[]) => string;
}
