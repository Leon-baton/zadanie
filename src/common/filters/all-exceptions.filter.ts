import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const isHttpException = exception instanceof HttpException;

        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        if (status >= 500) {
            this.logger.error(`Status: ${status} Error: ${exception?.message || exception}`, exception?.stack);
        }

        const responseBody = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: isHttpException
                ? (exception.getResponse() as any)?.message || exception.message
                : 'Internal server error',
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
}
