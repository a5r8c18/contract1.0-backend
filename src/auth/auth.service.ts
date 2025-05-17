/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as dns from 'dns';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    if (!email || !password) {
      throw new UnauthorizedException('Correo y contraseña son requeridos');
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'La contraseña del usuario no está definida',
      );
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: user.id,
      nombre: user.nombre,
      rol: user.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const adminEmails = this.configService
      .get<string>('ADMIN_EMAILS', '')
      .split(',')
      .filter(Boolean);
    const rol = adminEmails.includes(email) ? 'admin' : 'user';
    this.logger.debug(`Asignando rol: ${rol} para email: ${email}`);

    const saltRoundsRaw = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    const saltRounds = parseInt(saltRoundsRaw, 10);
    if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
      this.logger.error(
        `Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`,
      );
      throw new Error('Invalid BCRYPT_SALT_ROUNDS value');
    }
    this.logger.debug(`Usando BCRYPT_SALT_ROUNDS: ${saltRounds}`);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      nombre: name,
      rol,
    });
    return user;
  }

  async getProfile(userId: number, email: string): Promise<any> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (user.email !== email) {
      throw new UnauthorizedException(
        'Datos del token no coinciden con el usuario',
      );
    }
    return {
      name: user.nombre,
      email: user.email,
      phone:
        user.phone ||
        this.configService.get<string>('DEFAULT_PHONE', '+1234567890'),
      language:
        user.language ||
        this.configService.get<string>('DEFAULT_LANGUAGE', 'es'),
      avatar:
        user.avatar ||
        this.configService.get<string>(
          'DEFAULT_AVATAR',
          'https://randomuser.me/api/portraits/men/32.jpg',
        ),
      role: user.rol,
      memberSince:
        user.createdAt ||
        new Date(
          this.configService.get<string>('DEFAULT_MEMBER_SINCE', '2023-01-01'),
        ),
    };
  }

  async updateProfile(
    userId: number,
    updateData: Partial<{
      name: string;
      email: string;
      phone: string;
      language: string;
      avatar: string;
      password: string;
    }>,
  ): Promise<any> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const updatedData: Partial<User> = {
      nombre: updateData.name || user.nombre,
      email: updateData.email || user.email,
      phone: updateData.phone || user.phone,
      language: updateData.language || user.language,
      avatar: updateData.avatar || user.avatar,
    };

    if (updateData.password) {
      const saltRoundsRaw = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
      const saltRounds = parseInt(saltRoundsRaw, 10);
      if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
        this.logger.error(
          `Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`,
        );
        throw new Error('Invalid BCRYPT_SALT_ROUNDS value');
      }
      updatedData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    await this.userService.update(user.id, updatedData);
    return this.getProfile(user.id, updatedData.email || user.email);
  }

  resolveMx = promisify(dns.resolveMx);

  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    this.logger.debug(`Iniciando recuperación de contraseña para ${email}`);

    // Validar dominio
    const domain = email.split('@')[1];
    try {
      const mxRecords = await this.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        this.logger.warn(
          `No se encontraron registros MX para el dominio: ${domain}`,
        );
        throw new NotFoundException('Dominio de correo inválido');
      }
    } catch (error) {
      this.logger.error(`Error al validar dominio ${domain}: ${error.message}`);
      throw new NotFoundException('Dominio de correo inválido');
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      this.logger.warn(`Usuario no encontrado para email: ${email}`);
      throw new NotFoundException('Usuario no encontrado');
    }

    const payload = { email: user.email, sub: user.id, type: 'password-reset' };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    await this.userService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');
    if (!emailUser || !emailPass) {
      this.logger.error('Configuración de correo incompleta');
      throw new Error('Email service configuration is missing');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Usa SSL
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    try {
      this.logger.debug('Verificando conexión SMTP...');
      await transporter.verify();
      this.logger.debug('Conexión SMTP verificada exitosamente');
    } catch (error) {
      this.logger.error(`Error al verificar conexión SMTP: ${error.message}`);
      if (error.code === 'EAUTH') {
        throw new Error(
          'Autenticación SMTP fallida. Verifica EMAIL_USER y EMAIL_PASS. Asegúrate de usar una contraseña de aplicación si 2FA está habilitado.',
        );
      }
      if (error.code === 'ECONNECTION') {
        throw new Error(
          'No se pudo conectar al servidor SMTP de Gmail. Verifica host/port.',
        );
      }
      throw new Error(`SMTP connection failed: ${error.message}`);
    }

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    const maxRetries = 2;
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        this.logger.debug(
          `Enviando correo a ${email} (intento ${attempt + 1})`,
        );
        await transporter.sendMail({
          from: `"Soporte" <${emailUser}>`,
          to: user.email,
          subject: 'Recuperación de Contraseña',
          html: `
        <h3>Recuperación de Contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
        });
        this.logger.debug(`Correo de recuperación enviado a ${email}`);
        return;
      } catch (error) {
        this.logger.error(
          `Error al enviar correo (intento ${attempt + 1}): ${error.message}`,
        );
        attempt++;
        if (attempt > maxRetries) {
          throw new Error(`Failed to send email: ${error.message}`);
        }
        const delay = Math.pow(2, attempt) * 1000; // Backoff exponencial: 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload;
    try {
      payload = this.jwtService.verify(token);
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Token inválido');
      }
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const user = await this.userService.findOneByEmail(payload.email);
    if (
      !user ||
      user.resetPasswordToken !== token ||
      !user.resetPasswordExpires
    ) {
      throw new UnauthorizedException('Token inválido');
    }

    if (new Date() > user.resetPasswordExpires) {
      throw new UnauthorizedException('El token ha expirado');
    }

    const saltRoundsRaw = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    const saltRounds = parseInt(saltRoundsRaw, 10);
    if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
      this.logger.error(
        `Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`,
      );
      throw new Error('Invalid BCRYPT_SALT_ROUNDS value');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.userService.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  async testEmail(): Promise<void> {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');
    if (!emailUser || !emailPass) {
      this.logger.error('Configuración de correo incompleta');
      throw new Error('Email service configuration is missing');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Usa SSL
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    try {
      this.logger.debug('Verificando conexión SMTP...');
      await transporter.verify();
      this.logger.debug('Conexión SMTP válida');
      await transporter.sendMail({
        from: `"Soporte" <${emailUser}>`,
        to: 'cobaseliu@gmail.com',
        subject: 'Prueba',
        text: 'Correo de prueba',
      });
      this.logger.debug('Correo de prueba enviado');
    } catch (error) {
      this.logger.error(`Error en prueba de correo: ${error.message}`);
      throw error;
    }
  }
}
