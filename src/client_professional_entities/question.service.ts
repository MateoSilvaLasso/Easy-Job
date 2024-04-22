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

@Injectable()
export class QuestionService {
  private readonly logger = new Logger('QuestionService');

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const question =  this.questionRepository.create(createQuestionDto);

    await this.questionRepository.save(question);

    return question;
  }

  findAll( paginationDto: PaginationDto ) {
    const {limit = 10, offset= 0} = paginationDto;

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
}