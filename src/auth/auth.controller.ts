/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/jwt/local-auth.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { SignUpDto } from '../dto/signup.dto';
import { RecoverPasswordDto } from 'src/recover-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<{ access_token: string }> {
    this.logger.debug(`Usuario autenticado para login: ${req.user.email}`);
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
    try {
      await this.authService.register(
        signUpDto.email,
        signUpDto.password,
        signUpDto.name,
      );
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      this.logger.error(`Error al registrar usuario: ${error.message}`);
      throw new HttpException(
        { error: error.message || 'Error al registrar el usuario' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<any> {
    this.logger.debug(`Obteniendo perfil para usuario: ${req.user.email}`);
    if (!req.user) {
      throw new HttpException(
        'Usuario no autenticado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.authService.getProfile(
      req.user.id || req.user.sub,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.env.AVATAR_STORAGE_PATH || './Uploads/avatars');
        },
        filename: (req, file, cb) => {
          const filename = `avatar-${Date.now()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Solo imágenes JPG/PNG son permitidas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async updateProfile(
    @Request() req: any,
    @Body() updateData: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    this.logger.debug(`Actualizando perfil para usuario: ${req.user.email}`);
    if (!req.user) {
      throw new HttpException(
        'Usuario no autenticado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const updateProfileData = {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
      language: updateData.language,
      password: updateData.password,
      avatar: file
        ? `${this.configService.get<string>('AVATAR_URL_PREFIX', '/Uploads/avatars/')}${file.filename}`
        : updateData.avatar,
    };
    return this.authService.updateProfile(
      req.user.id || req.user.sub,
      updateProfileData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(): Promise<{ message: string }> {
    this.logger.debug('Cerrando sesión');
    return { message: 'Sesión cerrada exitosamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: any): Promise<{ access_token: string }> {
    this.logger.debug(`Refrescando token para usuario: ${req.user.email}`);
    const user = req.user;
    if (!user || !user.sub) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login({
      id: user.sub,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      avatar: user.avatar || '',
      phone: user.phone || '',
      language: user.language || '',
      createdAt: user.createdAt || new Date(),
      resetPasswordToken: user.resetPasswordToken || '',
      resetPasswordExpires: user.resetPasswordExpires || new Date(0),
    });
  }

  @Post('recover-password')
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.debug(
      `Solicitud de recuperación para email: ${recoverPasswordDto.email}`,
    );
    try {
      await this.authService.sendPasswordRecoveryEmail(
        recoverPasswordDto.email,
      );
      return {
        message:
          'El enlace para recuperar la contraseña ha sido enviado a tu correo.',
      };
    } catch (error) {
      this.logger.error(
        `Error al enviar enlace de recuperación: ${error.message}`,
      );
      if (error instanceof Error && error.message === 'Usuario no encontrado') {
        throw new HttpException(
          { error: 'Usuario no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        { error: error.message || 'Error al enviar el enlace de recuperación' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ): Promise<{ message: string }> {
    this.logger.debug('Solicitud para restablecer contraseña');
    try {
      await this.authService.resetPassword(body.token, body.newPassword);
      return { message: 'Contraseña restablecida exitosamente' };
    } catch (error) {
      this.logger.error(`Error al restablecer contraseña: ${error.message}`);
      throw new HttpException(
        { error: error.message || 'Error al restablecer la contraseña' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('test-email')
  async testEmail() {
    await this.authService.testEmail();
    return { message: 'Correo de prueba enviado' };
  }
}
