import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { TransactionHistoryEntity } from './entities/transaction-history.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, TransactionHistoryEntity])],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentsRepository],
    exports: [],
})
export class PaymentsModule {}
