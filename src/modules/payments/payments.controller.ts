import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PurchaseDto } from './dtos/purchase.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Биллинг')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('purchase')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Списание баланса' })
    async purchase(@Body() dto: PurchaseDto) {
        const updatedUser = await this.paymentsService.processPurchase(dto);
        return {
            userId: updatedUser.id,
            newBalance: updatedUser.balance,
        };
    }
}
