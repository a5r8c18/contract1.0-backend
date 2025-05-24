import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SignUpDto } from './signup.dto';
import { RecoverPasswordDto } from 'src/recover-password.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, configService: ConfigService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, updateData: any, file: Express.Multer.File): Promise<any>;
    logout(): Promise<{
        message: string;
    }>;
    refreshToken(req: any): Promise<{
        access_token: string;
    }>;
    recoverPassword(recoverPasswordDto: RecoverPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    testEmail(): Promise<{
        message: string;
    }>;
}
