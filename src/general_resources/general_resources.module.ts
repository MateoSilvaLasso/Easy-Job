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
import { AppointmentService } from '../client_professional_entities/appointment.service';
import { ClientsService } from '../clients/clients.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { Client } from '../clients/entities/client.entity';
import { ServiceService } from '../professionals/service.service';
import { Service } from '../professionals/entities/service.entity';
import { Type } from 'class-transformer';
import { Speciality } from '../professionals/entities/speciality.entity';
import { SpecialityService } from '../professionals/speciality.service';

@Module({
  controllers: [CityController, LanguageController, PaymentMethodController],
  providers: [CityService, LanguageService, PaymentMethodService, AppointmentService, ClientsService, ProfessionalsService, ServiceService, SpecialityService],
  imports: [
    TypeOrmModule.forFeature([City]),
    TypeOrmModule.forFeature([Department]),
    TypeOrmModule.forFeature([Language]),
    TypeOrmModule.forFeature([PaymentMethod]),
    TypeOrmModule.forFeature([Professional]),
    TypeOrmModule.forFeature([Appointment]),
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([Service]),
    TypeOrmModule.forFeature([Speciality])
  ],
  exports: [TypeOrmModule,GeneralResourcesModule, CityService, LanguageService, PaymentMethodService]
})
export class GeneralResourcesModule {}
