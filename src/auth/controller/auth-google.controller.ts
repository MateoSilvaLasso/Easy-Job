import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthProfessionalService } from '../services/auth-professional.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateProfessionalDto } from '../../professionals/dto/create-professional.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../entities/role.enum';
import { GetUser } from '../decorators/get-user.decorator';
import { RolesGuard } from '../guards/user/user.guard';
import { GoogleOauthGuard } from '../guards/user/google-oauth.guard';
import { Express, Request, Response } from 'express';
import { AuthgoogleService } from '../services/auth-google.service';


@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authService: AuthgoogleService) {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
        //console.log(req.user)
      const token = await this.authService.oAuthLogin(req.user); 
      res.redirect(`https://easy-job-frontend.vercel.app/oauth?id=${token.id}&email=${token.email}&token=${token.token}`);
      //res.redirect('http://localhost:3000/register')
      return token
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }

}
