/* eslint-disable prettier/prettier */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contrato')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: process.env.DEFAULT_CONTRACT_NAME || 'arrendamiento' })
  nombre: string;

  @Column({ type: 'timestamp' })
  fecha_creado: Date;
}
