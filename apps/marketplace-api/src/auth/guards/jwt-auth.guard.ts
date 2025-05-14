import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Opcional: puedes sobreescribir handleRequest para personalizar el manejo de errores
  // handleRequest(err, user, info, context: ExecutionContext) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('No estás autenticado o tu token es inválido.');
  //   }
  //   return user;
  // }
}
