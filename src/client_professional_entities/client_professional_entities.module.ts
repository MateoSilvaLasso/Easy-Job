import { Module } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entitiy';
import { Review } from './entities/review.entity';
import { Client } from '../clients/entities/client.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { QuestionController } from './controllers/questions.controller';
import { ReviewsController } from './controllers/reviews.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { QuestionService } from './question.service';
import { ReviewService } from './review.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { ServiceService } from '../professionals/service.service';
import { SpecialityService } from '../professionals/speciality.service';
import { Service } from '../professionals/entities/service.entity';
import { Speciality } from '../professionals/entities/speciality.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {City} from "../general_resources/entities/city.entity";
import { GeneralResourcesModule } from '../general_resources/general_resources.module';
import { PaymentMethod } from '../general_resources/entities/payment_method.entity';
import { PaymentMethodController } from '../general_resources/controllers/paymentMethod.controller';
import { PaymentMethodService } from '../general_resources/services/paymentMethod.service';

@Module({
  controllers: [QuestionController, ReviewsController, AppointmentController, PaymentMethodController ],
  providers: [AppointmentService, QuestionService, ReviewService, ProfessionalsService, ClientsService, ServiceService,
    SpecialityService, JwtStrategy, PaymentMethodService
  ],
  
  imports: [
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([Review]),
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([Professional]),
    TypeOrmModule.forFeature([Appointment]),
    TypeOrmModule.forFeature([Service]),
    TypeOrmModule.forFeature([Speciality]),
    TypeOrmModule.forFeature([City]),
    TypeOrmModule.forFeature([PaymentMethod]),
    GeneralResourcesModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
          secret: configService.get('JWT_SECRET') || 'secret',
          signOptions: {expiresIn:'2h'}
      })
    }), 
    ConfigModule
  ], 
  exports: [ClientProfessionalEntitiesModule, AppointmentService, QuestionService, ReviewService],
})
export class ClientProfessionalEntitiesModule {}
