import { Module } from '@nestjs/common';
import { AuthClientService } from './services/auth-client.service'
import { AuthProfessionalService } from './services/auth-professional.service';
import { AuthClientController } from './controller/auth-client.controller';
import { AuthProfessionalController } from './controller/auth-professional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/entities/client.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/user/user.guard';
import { APP_GUARD } from '@nestjs/core';
import { ProfessionalsService } from '../professionals/professionals.service';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { GeneralResourcesModule } from '../general_resources/general_resources.module';
import { Service } from '../professionals/entities/service.entity';
import { Type } from 'class-transformer';
import { Speciality } from '../professionals/entities/speciality.entity';
import { GoogleStrategy } from './strategies/google-oauth.strategy';
import { GoogleOauthGuard } from './guards/user/google-oauth.guard';
import { AuthAdminController } from './controller/auth-admin.controller';
import { AuthGoogleController } from './controller/auth-google.controller';
import { AuthAdminService } from './services/auth-admin.service';
import { AuthgoogleService } from './services/auth-google.service';
import { ClientsService } from '../clients/clients.service';
//import { JwtProfessionalStrategy } from './strategies/jwt-professional.strategy';

@Module({
  controllers: [AuthClientController, AuthProfessionalController, AuthAdminController, AuthGoogleController],
  providers: [AuthClientService, AuthProfessionalService, JwtStrategy,RolesGuard, ProfessionalsService, GoogleStrategy, GoogleOauthGuard, AuthAdminService, AuthgoogleService, ClientsService],
  imports: [
    ConfigModule,
    ProfessionalsModule,
    GeneralResourcesModule,
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([Professional]),
    TypeOrmModule.forFeature([Service]),
    TypeOrmModule.forFeature([Speciality]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
          secret: configService.get('JWT_SECRET') || 'secret',
          signOptions: {expiresIn:'20h'}
      })
    })
  ],
  exports: [TypeOrmModule, AuthModule]
})
export class AuthModule {}
