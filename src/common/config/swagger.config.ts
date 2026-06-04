import { registerAs } from '@nestjs/config';

export const swaggerConfig = registerAs('swagger', () => ({
    path: process.env.SWAGGER_PATH ?? 'docs',
    login: process.env.SWAGGER_LOGIN ?? '',
    password: process.env.SWAGGER_PASSWORD ?? '',
}));
