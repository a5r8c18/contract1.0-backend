"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("./settings.entity");
let SettingsService = class SettingsService {
    settingsRepository;
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async getSettings(userId) {
        let settings = await this.settingsRepository.findOne({ where: { userId } });
        if (!settings) {
            settings = this.settingsRepository.create({
                userId,
                contractPrefix: process.env.DEFAULT_CONTRACT_PREFIX || 'CON-',
                autoNumbering: process.env.DEFAULT_AUTO_NUMBERING === 'true',
                defaultExpirationDays: parseInt(process.env.DEFAULT_EXPIRATION_DAYS || '30', 10),
                notificationDays: parseInt(process.env.DEFAULT_NOTIFICATION_DAYS || '7', 10),
                approvalWorkflow: process.env.DEFAULT_APPROVAL_WORKFLOW || 'two-level',
                signatureMethod: process.env.DEFAULT_SIGNATURE_METHOD || 'digital',
                emailNotifications: process.env.DEFAULT_EMAIL_NOTIFICATIONS === 'true',
                documentRetentionYears: parseInt(process.env.DEFAULT_DOCUMENT_RETENTION_YEARS || '5', 10),
                allowEditing: process.env.DEFAULT_ALLOW_EDITING === 'true',
            });
            await this.settingsRepository.save(settings);
        }
        return settings;
    }
    async updateSettings(userId, updateData) {
        let settings = await this.settingsRepository.findOne({ where: { userId } });
        if (!settings) {
            settings = this.settingsRepository.create({
                userId,
                contractPrefix: process.env.DEFAULT_CONTRACT_PREFIX || 'CON-',
                autoNumbering: process.env.DEFAULT_AUTO_NUMBERING === 'true',
                defaultExpirationDays: parseInt(process.env.DEFAULT_EXPIRATION_DAYS || '30', 10),
                notificationDays: parseInt(process.env.DEFAULT_NOTIFICATION_DAYS || '7', 10),
                approvalWorkflow: process.env.DEFAULT_APPROVAL_WORKFLOW || 'two-level',
                signatureMethod: process.env.DEFAULT_SIGNATURE_METHOD || 'digital',
                emailNotifications: process.env.DEFAULT_EMAIL_NOTIFICATIONS === 'true',
                documentRetentionYears: parseInt(process.env.DEFAULT_DOCUMENT_RETENTION_YEARS || '5', 10),
                allowEditing: process.env.DEFAULT_ALLOW_EDITING === 'true',
            });
        }
        Object.assign(settings, updateData);
        return this.settingsRepository.save(settings);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settings_entity_1.Settings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map