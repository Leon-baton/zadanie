import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { PurchaseDto } from './dtos/purchase.dto';
import { EActionType } from './enums/action-type.enum';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
    constructor(private readonly paymentsRepository: PaymentsRepository) {}

    async processPurchase(dto: PurchaseDto): Promise<UserEntity> {
        return this.paymentsRepository.withTransaction('REPEATABLE READ', async (manager) => {
            const user = await this.paymentsRepository.getUserWithLock(manager, dto.userId);
            if (!user) {
                throw new NotFoundException(`Пользователь с ID ${dto.userId} не найден`);
            }

            if (+user.balance < dto.amount) {
                throw new BadRequestException('Недостаточно средств на балансе');
            }

            await this.paymentsRepository.addHistoryRecord(manager, user.id, dto.amount, EActionType.PURCHASE);

            const calculatedFromHistoryBalance = await this.paymentsRepository.getBalanceFromHistory(manager, user.id);
            user.balance = calculatedFromHistoryBalance;

            return this.paymentsRepository.saveUser(manager, user);
        });
    }
}
