import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Question } from './entities/question.entitiy';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Client} from '../clients/entities/client.entity'
import { ClientsService } from '../clients/clients.service';
import { ProfessionalsService } from '../professionals/professionals.service';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger('QuestionService');

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly clientService: ClientsService,
    private readonly professionalService: ProfessionalsService
  ) {}

  async create(id_client: string, id_professional: string, createQuestionDto: CreateQuestionDto) {

    const question = this.questionRepository.create({
      title: createQuestionDto.title,
      question_description: createQuestionDto.question_description
    });

    const client = await this.clientService.findOne(id_client);

    const professional = await this.professionalService.findOne(id_professional);

    question.client = client

    question.professional = professional

    await this.questionRepository.save(question);
    
    
    return question;
  }

  findAll( limit: number, offset: number ) {

    return this.questionRepository.find({
      take: limit, 
      skip: offset,
    })

  }

  async findOne(id_question: string) {

    let question: Question;

    if(isUUID(id_question)){
      question = await this.questionRepository.findOneBy({id: id_question});
    }

    if(!question){
      throw new NotFoundException(`Question with ${id_question} not found`)
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.preload({
      id: id,
      ...updateQuestionDto
  });

    if ( !question ) throw new NotFoundException(`Question with id: ${ id } not found`);

    try {
      await this.questionRepository.save( question );
      return question;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async getQuestionsByProfessional(id_professional: string): Promise<Question[]> {
    return this.questionRepository.find({
      where: { professional: { id: id_professional } },
      relations: ['client'],
    });
  }
}
