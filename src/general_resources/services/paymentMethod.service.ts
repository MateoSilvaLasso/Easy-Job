import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../entities/payment_method.entity';
import { CreatePaymentMethodDto } from '../dto/create-paymentMethod';

@Injectable()
export class PaymentMethodService {
    constructor(
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
    ) {}

    async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
        const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
        return this.paymentMethodRepository.save(paymentMethod);
    }

    async findAll(): Promise<PaymentMethod[]> {
        return this.paymentMethodRepository.find();
    }

    async findOne(id: string): Promise<PaymentMethod> {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({ id });
        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }
        return paymentMethod;
    }
}
