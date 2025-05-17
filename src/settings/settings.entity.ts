/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractPrefix: string;

  @Column({ default: true })
  autoNumbering: boolean;

  @Column()
  defaultExpirationDays: number;

  @Column()
  notificationDays: number;

  @Column()
  approvalWorkflow: string;

  @Column()
  signatureMethod: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column()
  userId: number;

  @Column()
  documentRetentionYears: number;

  @Column({ default: false })
  allowEditing: boolean;
}
