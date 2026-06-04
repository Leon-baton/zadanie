import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PurchaseDto {
    @ApiProperty({ description: 'ID пользователя', example: 1 })
    @IsInt()
    userId: number;

    @ApiProperty({ description: 'Сумма покупки', example: 100 })
    @IsNumber()
    @Min(0.01)
    amount: number;
}
