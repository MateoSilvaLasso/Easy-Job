import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {QuestionService} from '../question.service'
import {CreateQuestionDto} from '../dto/create-question.dto'
import {PaginationDto} from '../../common/dtos/pagination.dto'
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/user/user.guard';
import { Role } from '../../auth/entities/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService
  ) {}

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(Role.Client)
  @Post(':client_id/:professional_id')
  create(@Body() createQuestionDto: CreateQuestionDto, @Param('client_id') client_id: string, @Param('professional_id') professional_id: string ) {
    return this.questionService.create(client_id,professional_id,createQuestionDto);
  }

   
  @UseGuards(AuthGuard())
  @Get()
  findAll() {
     return this.questionService.findAll(10,0);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
     return this.questionService.findOne(id);
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(Role.Client)
   @Delete(':id')
      remove(@Param('id') id: string) {
     return this.questionService.remove(id);
   }

   @Get('professional/:id_professional')
      getQuestionsByProfessional(@Param('id_professional') id_professional: string) {
         return this.questionService.getQuestionsByProfessional(id_professional);
      }
}
