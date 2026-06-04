import { TransactionHistoryEntity } from "@/modules/payments/entities/transaction-history.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    balance: number;

    @OneToMany(() => TransactionHistoryEntity, (history) => history.user)
    history: TransactionHistoryEntity[];
}
