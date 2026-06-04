import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryEntity } from '../payments/entities/transaction-history.entity';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, TransactionHistoryEntity])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
