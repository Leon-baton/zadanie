import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { UserEntity } from '../users/entities/user.entity';
import { TransactionHistoryEntity } from './entities/transaction-history.entity';
import { EActionType } from './enums/action-type.enum';

@Injectable()
export class PaymentsRepository {
    constructor(private readonly dataSource: DataSource) {}

    async withTransaction<T>(
        isolationLevel: IsolationLevel,
        callback: (manager: EntityManager) => Promise<T>,
    ): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction(isolationLevel);

        try {
            const result = await callback(queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getUserWithLock(manager: EntityManager, userId: number): Promise<UserEntity | null> {
        return manager.findOne(UserEntity, {
            where: { id: userId },
            lock: { mode: 'pessimistic_write' },
        });
    }

    async addHistoryRecord(manager: EntityManager, userId: number, amount: number, action: EActionType): Promise<void> {
        const historyRecord = manager.create(TransactionHistoryEntity, {
            userId,
            action,
            amount,
        });
        await manager.save(historyRecord);
    }

    async getBalanceFromHistory(manager: EntityManager, userId: number): Promise<number> {
        const result = await manager
            .createQueryBuilder(TransactionHistoryEntity, 'history')
            .select(
                `SUM(CASE WHEN history.action = :top_up THEN history.amount ELSE -history.amount END)`,
                'calculatedBalance',
            )
            .setParameters({ top_up: EActionType.TOP_UP })
            .where('history.userId = :userId', { userId })
            .getRawOne();

        return +result?.calculatedBalance || 0;
    }

    async saveUser(manager: EntityManager, user: UserEntity): Promise<UserEntity> {
        return manager.save(user);
    }
}
