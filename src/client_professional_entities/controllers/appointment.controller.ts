import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {QuestionService} from '../question.service'
import {CreateQuestionDto} from '../dto/create-question.dto'
import {PaginationDto} from '../../common/dtos/pagination.dto'
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/user/user.guard';
import { Role } from '../../auth/entities/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AppointmentService } from '../appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService
  ) {}


  @Post(':client_id/:professional_id/:payment_method_name')
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Param('client_id') client_id: string, @Param('professional_id') professional_id: string, @Param('paymentMethod_name') payment_method_name : string) {
    return this.appointmentService.create(client_id,professional_id,payment_method_name, createAppointmentDto);
  }

   
  @UseGuards(AuthGuard())
  @Get()
  findAll() {
     return this.appointmentService.findAll({limit: 10, offset: 0});
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
     return this.appointmentService.findOne(id);
  }

   @UseGuards(AuthGuard(),RolesGuard)
   @Roles(Role.Client, Role.Professional)
   @Delete(':id')
      remove(@Param('id') id: string) {
     return this.appointmentService.remove(id);
   }
}
