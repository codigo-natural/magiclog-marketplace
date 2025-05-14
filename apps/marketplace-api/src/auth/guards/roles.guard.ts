import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // Si no se especifican roles, se permite el acceso (asumiendo que JwtAuthGuard ya pasó)
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false; // No hay usuario o no tiene rol
    }
    return requiredRoles.some((role) => user.role === role);
  }
}
