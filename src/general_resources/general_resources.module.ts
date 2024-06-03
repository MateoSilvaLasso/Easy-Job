import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Department } from './entities/department.entity';
import { Language } from './entities/language.entity';
import { PaymentMethod } from './entities/payment_method.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { CityService } from './services/city.service';
import { LanguageService } from './services/language.service';
import { CityController } from './controllers/city.controller';
import { LanguageController } from './controllers/language.controller';
import { PaymentMethodService } from './services/paymentMethod.service';
import { PaymentMethodController } from './controllers/paymentMethod.controller';
import { Appointment } from '../client_professional_entities/entities/appointment.entity';

@Module({
  controllers: [CityController, LanguageController, PaymentMethodController],
  providers: [CityService, LanguageService, PaymentMethodService],
  imports: [
    TypeOrmModule.forFeature([City]),
    TypeOrmModule.forFeature([Department]),
    TypeOrmModule.forFeature([Language]),
    TypeOrmModule.forFeature([PaymentMethod]),
    TypeOrmModule.forFeature([Professional]),
    TypeOrmModule.forFeature([Appointment])
  ],
  exports: [GeneralResourcesModule, CityService, LanguageService, TypeOrmModule, PaymentMethodService]
})
export class GeneralResourcesModule {}
