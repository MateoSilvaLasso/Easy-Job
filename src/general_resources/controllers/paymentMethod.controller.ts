import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMethodService } from '../services/paymentMethod.service';
import { CreatePaymentMethodDto } from '../dto/create-paymentMethod';

@Controller('payment-method')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) {}

    @Post()
    create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        return this.paymentMethodService.create(createPaymentMethodDto);
    }

    @Get()
    findAll() {
        return this.paymentMethodService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentMethodService.findOne(id);
    }
}
