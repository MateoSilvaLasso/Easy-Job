import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {


  private readonly logger = new Logger('ServiceService');

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service =  this.serviceRepository.create(createServiceDto);

    await this.serviceRepository.save(service);

    return service;
  }

  findAll( limit :number, offset:number ) {

    return this.serviceRepository.find({
      take: limit, 
      skip: offset,
    })

  }

  async findOne(name_service: string) {

    let service: Service;

    
    service = await this.serviceRepository.findOne({where :{id: name_service}});
    

    if(!service){
      throw new NotFoundException(`Service with ${name_service} not found`)
    }

    return service;
  }

  async findByTitle(title_service: string){
    const service = await this.serviceRepository.findOneBy({title: title_service});

    if(!service){
      throw new NotFoundException(`Service with ${title_service} not found`)
    }

    return service;
  }

  async findByPrice(price: number){
    const service = await this.serviceRepository.findOneBy({price:price});

    if(!service){
      throw new NotFoundException(`Service with ${price} not found`)
    }

    return service;

  }

  async findByCity(city_name: string){
    const services = await this.serviceRepository
                    .createQueryBuilder('service')
                    .innerJoin("service.professionals", "professional")
                    .innerJoin("professional.cities", "city")
                    .where("city.city_name = :name", { name: city_name })
                    .getMany()
    return services
  }

  async findByDeparment(deparment_name: string){
    const services = await this.serviceRepository
                    .createQueryBuilder('service')
                    .innerJoin('service.professionals', 'professional')
                    .innerJoin('professional.cities', 'city')
                    .innerJoin('city.department', 'department')
                    .where('department.department_name = :name', {name:deparment_name})
                    .getMany()
    return services
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.preload({
      id: id,
      ...updateServiceDto
    });

    if ( !service ) throw new NotFoundException(`Service with id: ${ id } not found`);

    try {
      await this.serviceRepository.save( service );
      return service;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
