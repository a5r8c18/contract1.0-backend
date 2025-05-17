import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as dns from 'dns';
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<Omit<User, 'password'>>;
    login(user: Omit<User, 'password'>): Promise<{
        access_token: string;
    }>;
    register(email: string, password: string, name: string): Promise<User>;
    getProfile(userId: number, email: string): Promise<any>;
    updateProfile(userId: number, updateData: Partial<{
        name: string;
        email: string;
        phone: string;
        language: string;
        avatar: string;
        password: string;
    }>): Promise<any>;
    resolveMx: typeof dns.resolveMx.__promisify__;
    sendPasswordRecoveryEmail(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    testEmail(): Promise<void>;
}
