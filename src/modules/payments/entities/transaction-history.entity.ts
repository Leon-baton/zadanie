import { UserEntity } from '@/modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v7 } from 'uuid';
import { EActionType } from '../enums/action-type.enum';

@Entity('transaction_history')
export class TransactionHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = v7();

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity, (user) => user.history, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'enum', enum: EActionType })
    action: EActionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn()
    ts: Date;
}
