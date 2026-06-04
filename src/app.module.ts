import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Filters } from './common';
import { CoreModule } from './common/core.module';
import { ApiModule } from './modules/api.module';

@Module({
    imports: [CoreModule, ApiModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: Filters.AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
