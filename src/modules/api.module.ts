import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [UsersModule, PaymentsModule],
})
export class ApiModule {}
