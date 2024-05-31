import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../auth/entities/role.enum';
import { ROLES_KEY } from '../../../auth/decorators/roles.decorator';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/auth/entities/user.entity';
import { Professional } from 'src/professionals/entities/professional.entity';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    
    const user = req.user
    if (!user) {
      console.log("No user found in request");
      throw new UnauthorizedException("No user found in request");
    }
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}