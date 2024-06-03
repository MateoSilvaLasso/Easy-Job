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

    @Get(':payment_method_name')
    findOne(@Param('payment_method_name') payment_method_name: string) {
        return this.paymentMethodService.findOneByName(payment_method_name);
    }
}
