/* eslint-disable prettier/prettier */
// SettingsService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(userId: number): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        contractPrefix: process.env.DEFAULT_CONTRACT_PREFIX || 'CON-',
        autoNumbering: process.env.DEFAULT_AUTO_NUMBERING === 'true',
        defaultExpirationDays: parseInt(
          process.env.DEFAULT_EXPIRATION_DAYS || '30',
          10,
        ),
        notificationDays: parseInt(
          process.env.DEFAULT_NOTIFICATION_DAYS || '7',
          10,
        ),
        approvalWorkflow: process.env.DEFAULT_APPROVAL_WORKFLOW || 'two-level',
        signatureMethod: process.env.DEFAULT_SIGNATURE_METHOD || 'digital',
        emailNotifications: process.env.DEFAULT_EMAIL_NOTIFICATIONS === 'true',
        documentRetentionYears: parseInt(
          process.env.DEFAULT_DOCUMENT_RETENTION_YEARS || '5',
          10,
        ),
        allowEditing: process.env.DEFAULT_ALLOW_EDITING === 'true',
      });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateSettings(
    userId: number,
    updateData: Partial<Settings>,
  ): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        contractPrefix: process.env.DEFAULT_CONTRACT_PREFIX || 'CON-',
        autoNumbering: process.env.DEFAULT_AUTO_NUMBERING === 'true',
        defaultExpirationDays: parseInt(
          process.env.DEFAULT_EXPIRATION_DAYS || '30',
          10,
        ),
        notificationDays: parseInt(
          process.env.DEFAULT_NOTIFICATION_DAYS || '7',
          10,
        ),
        approvalWorkflow: process.env.DEFAULT_APPROVAL_WORKFLOW || 'two-level',
        signatureMethod: process.env.DEFAULT_SIGNATURE_METHOD || 'digital',
        emailNotifications: process.env.DEFAULT_EMAIL_NOTIFICATIONS === 'true',
        documentRetentionYears: parseInt(
          process.env.DEFAULT_DOCUMENT_RETENTION_YEARS || '5',
          10,
        ),
        allowEditing: process.env.DEFAULT_ALLOW_EDITING === 'true',
      });
    }
    Object.assign(settings, updateData);
    return this.settingsRepository.save(settings);
  }
}
