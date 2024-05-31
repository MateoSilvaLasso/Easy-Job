import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Professional } from '../../professionals/entities/professional.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateProfessionalDto } from '../../professionals/dto/create-professional.dto';
import { ProfessionalsService } from '../../professionals/professionals.service';
import { Client } from '../../clients/entities/client.entity';
import { CreateClientDto } from '../../clients/dto/create-client.dto';
import { ClientsService } from '../../clients/clients.service';
import { configDotenv } from 'dotenv';
import { AuthClientService } from './auth-client.service';

configDotenv();

@Injectable()
export class AuthgoogleService {
  constructor(
    @InjectRepository(Professional)
    private readonly userRepository: Repository<Professional>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
    private readonly professionalService: ProfessionalsService,
    private readonly clientService: AuthClientService

  ) {}

  async oAuthLogin(user) {
    if (!user) {
      throw new Error('User not found!!!');
    }

    //    .... your business logic
    const email = user.email
    console.log(email)

    const existUser = await this.clientRepository.findOne({
        where : {email},
        select : {id:true, email:true, password:true}
    })
    
    if(!existUser){
        
        let client = new CreateClientDto()
        client.name = user.name,
        client.last_name = user.last_name,
        client.email = user.email,
        client.photo_url = user.picture,
        client.password = process.env.GOOGLE_PASSWORD

        await this.clientService.create(client)
    }
    //console.log(existUser)

    const createdtUser = await this.clientRepository.findOne({
      where : {email},
      select : {id:true, email:true, password:true}
    })
    let payload
    if(!existUser){
      payload = {
        id : existUser.id,
        email: user.email,
        name: user.name,
      };
    }else{
      payload = {
        id : createdtUser.id,
        email: user.email,
        name: user.name,
      };
    }
    
  
    return {
        ...payload,
        token : this.jwtService.sign({id: payload.id})
    }


    //   .... add whatever payload you want to have
  }

}
