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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dns = require("dns");
const util_1 = require("util");
let AuthService = AuthService_1 = class AuthService {
    userService;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        if (!email || !password) {
            throw new common_1.UnauthorizedException('Correo y contraseña son requeridos');
        }
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('La contraseña del usuario no está definida');
        }
        if (await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        throw new common_1.UnauthorizedException('Credenciales inválidas');
    }
    async login(user) {
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
    async register(email, password, name) {
        const existingUser = await this.userService.findOneByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        const adminEmails = this.configService
            .get('ADMIN_EMAILS', '')
            .split(',')
            .filter(Boolean);
        const rol = adminEmails.includes(email) ? 'admin' : 'user';
        this.logger.debug(`Asignando rol: ${rol} para email: ${email}`);
        const saltRoundsRaw = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
        const saltRounds = parseInt(saltRoundsRaw, 10);
        if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
            this.logger.error(`Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`);
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
    async getProfile(userId, email) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (user.email !== email) {
            throw new common_1.UnauthorizedException('Datos del token no coinciden con el usuario');
        }
        return {
            name: user.nombre,
            email: user.email,
            phone: user.phone ||
                this.configService.get('DEFAULT_PHONE', '+1234567890'),
            language: user.language ||
                this.configService.get('DEFAULT_LANGUAGE', 'es'),
            avatar: user.avatar ||
                this.configService.get('DEFAULT_AVATAR', 'https://randomuser.me/api/portraits/men/32.jpg'),
            role: user.rol,
            memberSince: user.createdAt ||
                new Date(this.configService.get('DEFAULT_MEMBER_SINCE', '2023-01-01')),
        };
    }
    async updateProfile(userId, updateData) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const updatedData = {
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
                this.logger.error(`Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`);
                throw new Error('Invalid BCRYPT_SALT_ROUNDS value');
            }
            updatedData.password = await bcrypt.hash(updateData.password, saltRounds);
        }
        await this.userService.update(user.id, updatedData);
        return this.getProfile(user.id, updatedData.email || user.email);
    }
    resolveMx = (0, util_1.promisify)(dns.resolveMx);
    async sendPasswordRecoveryEmail(email) {
        this.logger.debug(`Iniciando recuperación de contraseña para ${email}`);
        const domain = email.split('@')[1];
        try {
            const mxRecords = await this.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                this.logger.warn(`No se encontraron registros MX para el dominio: ${domain}`);
                throw new common_1.NotFoundException('Dominio de correo inválido');
            }
        }
        catch (error) {
            this.logger.error(`Error al validar dominio ${domain}: ${error.message}`);
            throw new common_1.NotFoundException('Dominio de correo inválido');
        }
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            this.logger.warn(`Usuario no encontrado para email: ${email}`);
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const payload = { email: user.email, sub: user.id, type: 'password-reset' };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        await this.userService.update(user.id, {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        });
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPass = this.configService.get('EMAIL_PASS');
        if (!emailUser || !emailPass) {
            this.logger.error('Configuración de correo incompleta');
            throw new Error('Email service configuration is missing');
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
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
        }
        catch (error) {
            this.logger.error(`Error al verificar conexión SMTP: ${error.message}`);
            if (error.code === 'EAUTH') {
                throw new Error('Autenticación SMTP fallida. Verifica EMAIL_USER y EMAIL_PASS. Asegúrate de usar una contraseña de aplicación si 2FA está habilitado.');
            }
            if (error.code === 'ECONNECTION') {
                throw new Error('No se pudo conectar al servidor SMTP de Gmail. Verifica host/port.');
            }
            throw new Error(`SMTP connection failed: ${error.message}`);
        }
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
        const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;
        const maxRetries = 2;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                this.logger.debug(`Enviando correo a ${email} (intento ${attempt + 1})`);
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
            }
            catch (error) {
                this.logger.error(`Error al enviar correo (intento ${attempt + 1}): ${error.message}`);
                attempt++;
                if (attempt > maxRetries) {
                    throw new Error(`Failed to send email: ${error.message}`);
                }
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
            if (payload.type !== 'password-reset') {
                throw new common_1.UnauthorizedException('Token inválido');
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
        const user = await this.userService.findOneByEmail(payload.email);
        if (!user ||
            user.resetPasswordToken !== token ||
            !user.resetPasswordExpires) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
        if (new Date() > user.resetPasswordExpires) {
            throw new common_1.UnauthorizedException('El token ha expirado');
        }
        const saltRoundsRaw = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
        const saltRounds = parseInt(saltRoundsRaw, 10);
        if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
            this.logger.error(`Valor inválido para BCRYPT_SALT_ROUNDS: ${saltRoundsRaw}`);
            throw new Error('Invalid BCRYPT_SALT_ROUNDS value');
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await this.userService.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
    }
    async testEmail() {
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPass = this.configService.get('EMAIL_PASS');
        if (!emailUser || !emailPass) {
            this.logger.error('Configuración de correo incompleta');
            throw new Error('Email service configuration is missing');
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
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
        }
        catch (error) {
            this.logger.error(`Error en prueba de correo: ${error.message}`);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map