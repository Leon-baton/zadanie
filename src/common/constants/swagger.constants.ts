export const ACCESS_TOKEN_KEY: string = 'access-token';
export const REFRESH_TOKEN_KEY: string = 'refresh-token';
export const DEFAULT_AUTH_CONFIG: any = {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'Authorization',
    description: 'JWT access-token',
    in: 'header',
};
