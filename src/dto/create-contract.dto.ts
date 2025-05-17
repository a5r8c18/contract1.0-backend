/* eslint-disable prettier/prettier */

import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateContractDto {
  @IsString()
  nombre: string;

  @IsNumber()
  id: number;

  @IsDate()
  fecha_creado: Date;
}
