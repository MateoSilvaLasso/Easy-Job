import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ProfessionalsService } from '../professionals.service';
import { CreateProfessionalDto } from '../dto/create-professional.dto';
import {PaginationDto} from '../../common/dtos/pagination.dto'
import { UpdateProfessionalDto } from '../dto/update-professional.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Roles} from "../../auth/decorators/roles.decorator";
import {Role} from "../../auth/entities/role.enum";

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }


  @UseGuards(AuthGuard())
  @Get()
  findAll() {
    return this.professionalsService.findAll(10,0);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, updateProfessionalDto);
  }


  @UseGuards(AuthGuard())
  @Roles(Role.Professional)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }


  @UseGuards(AuthGuard())
  @Roles(Role.Professional)
  @Post('service/:id_professional/:id_service')
  addService(@Param('id_professional') id_professional: string,@Param('id_service') id_service: string){
    return this.professionalsService.addServiceToProfessional(id_professional, id_service);
  }

  @UseGuards(AuthGuard())
  @HttpCode(200)
  @Roles(Role.Professional)
  @Post('specialities/:id_professional/:id_speciality')
  addSpeciality(@Param('id_professional') id_professional: string,@Param('id_speciality') id_speciality:string){
      return this.professionalsService.addSpecialityToProfessional(id_professional,id_speciality);
  }


  @Roles(Role.Professional)
  @Post('city/:id_city/professional/:id_professional')
  addCities(@Param('id_professional') id_professional:string, @Param('id_city') id_city:string ){
    return this.professionalsService.addCityToProfessional(id_professional,id_city);
  }


  @UseGuards(AuthGuard())

  @Get('services/:id_professional')
  findServices(@Param('id_professional') id_professional: string){
    return this.professionalsService.findServices(id_professional)
  }

  @UseGuards(AuthGuard())
  @Get('specialities/:id_professional')
  findSpeciality(@Param('id_professional') id_professional: string){
    return this.professionalsService.findSpecialities(id_professional);
  }

  @UseGuards(AuthGuard())
  @Get('city/:city_name')
  findByCity(@Param('city_name') city_name: string){
    return this.professionalsService.findByCity(city_name);
  }

  @UseGuards(AuthGuard())
  @Get('cities/:id_professional')
  findCities(@Param('id_professional') id_professional:string){
    return this.professionalsService.findCities(id_professional);
  }

}
