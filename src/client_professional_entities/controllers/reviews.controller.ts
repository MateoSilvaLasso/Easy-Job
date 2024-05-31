import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from '../review.service';
import { CreateProfessionalDto } from 'src/professionals/dto/create-professional.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('reviews')
export class ReviewsController {

  constructor(
    private readonly reviewsService: ReviewService
    ) {}

    @Get()
    @UseGuards(AuthGuard())
    findAll() {
        return this.reviewsService.findAll({limit: 10, offset: 0});
    }
    @Get('/:id_review')
    @UseGuards(AuthGuard())
    findOne(@Param('id_review') id_review: string) {
        return this.reviewsService.findOne(id_review);
    }

    @UseGuards(AuthGuard())
    @Post('/client/:id_client/profesional/:id_professional')
    create( @Param('id_client') id_client:string , @Param('id_professional') id_professional:string, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(id_client, id_professional, createReviewDto);
    }

    @UseGuards(AuthGuard())
    @Delete('/:id_review')
    remove(@Param('id_review') id_review: string) {
        return this.reviewsService.remove(id_review);
    }

    @Get('professional/:id_professional')
    async getReviewsByProfessional(@Param('id_professional') id_professional: string) {
        return this.reviewsService.getReviewsByProfessional(id_professional);
    }

}
