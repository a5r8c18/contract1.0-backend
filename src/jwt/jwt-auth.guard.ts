/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('Verificando autenticación JWT');
    try {
      return super.canActivate(context);
    } catch (error) {
      this.logger.error(`Fallo en autenticación: ${error.message}`);
      throw error;
    }
  }
}
