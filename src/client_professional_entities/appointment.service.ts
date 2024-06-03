import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ClientsService } from '../clients/clients.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { PaymentMethodService } from 'src/general_resources/services/paymentMethod.service';
import { CreatePaymentMethodDto } from 'src/general_resources/dto/create-paymentMethod';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger('ServiceService');

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly clientService: ClientsService, 
    private readonly professionalsService: ProfessionalsService,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async create(clientId: string, professionalId: string, paymentMethodName: string, createAppointmentDto: CreateAppointmentDto) {

      const client = await this.clientService.findOne(clientId);
      const professional = await this.professionalsService.findOne(professionalId);

      if (!client || !professional) {
        throw new NotFoundException('Cliente o profesional no encontrado');
      }

      const paymentMethodDto: CreatePaymentMethodDto = {
        payment_method_name: paymentMethodName
      };
      const paymentMethod = await this.paymentMethodService.create(paymentMethodDto);

      if (!paymentMethod) {
        throw new InternalServerErrorException('Error al crear el método de pago');
      }

      createAppointmentDto.payment_method.id = paymentMethod.id;

      createAppointmentDto.client = client;
      createAppointmentDto.professional = professional;

      const appointment = this.appointmentRepository.create(createAppointmentDto);
      return this.appointmentRepository.save(appointment);
  }

  findAll( paginationDto: PaginationDto ) {
    const {limit = 10, offset= 0} = paginationDto;

    return this.appointmentRepository.find({
      take: limit, 
      skip: offset,
    })

  }

  async findOne(id_appointment: string) {

    let appointment: Appointment;

    if(isUUID(id_appointment)){
      appointment = await this.appointmentRepository.findOneBy({id: id_appointment});
    }

    if(!appointment){
      throw new NotFoundException(`Appointment with ${id_appointment} not found`)
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.preload({
      id: id,
      ...updateAppointmentDto
    });

    if ( !appointment ) throw new NotFoundException(`Appointment with id: ${ id } not found`);

    try {
      await this.appointmentRepository.save( appointment );
      return appointment;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
