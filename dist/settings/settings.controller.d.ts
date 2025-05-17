import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(req: any): Promise<any>;
    updateSettings(req: any, updateData: any): Promise<any>;
}
