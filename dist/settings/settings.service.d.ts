import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
export declare class SettingsService {
    private settingsRepository;
    constructor(settingsRepository: Repository<Settings>);
    getSettings(userId: number): Promise<Settings>;
    updateSettings(userId: number, updateData: Partial<Settings>): Promise<Settings>;
}
