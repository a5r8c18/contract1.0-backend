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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("../jwt/local-auth.guard");
const jwt_auth_guard_1 = require("../jwt/jwt-auth.guard");
const signup_dto_1 = require("../dto/signup.dto");
const recover_password_dto_1 = require("../recover-password.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let AuthController = AuthController_1 = class AuthController {
    authService;
    configService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async login(req) {
        this.logger.debug(`Usuario autenticado para login: ${req.user.email}`);
        return this.authService.login(req.user);
    }
    async signUp(signUpDto) {
        try {
            await this.authService.register(signUpDto.email, signUpDto.password, signUpDto.name);
            return { message: 'Usuario creado exitosamente' };
        }
        catch (error) {
            this.logger.error(`Error al registrar usuario: ${error.message}`);
            throw new common_1.HttpException({ error: error.message || 'Error al registrar el usuario' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getProfile(req) {
        this.logger.debug(`Obteniendo perfil para usuario: ${req.user.email}`);
        if (!req.user) {
            throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.authService.getProfile(req.user.id || req.user.sub, req.user.email);
    }
    async updateProfile(req, updateData, file) {
        this.logger.debug(`Actualizando perfil para usuario: ${req.user.email}`);
        if (!req.user) {
            throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
        }
        const updateProfileData = {
            name: updateData.name,
            email: updateData.email,
            phone: updateData.phone,
            language: updateData.language,
            password: updateData.password,
            avatar: file
                ? `${this.configService.get('AVATAR_URL_PREFIX', '/Uploads/avatars/')}${file.filename}`
                : updateData.avatar,
        };
        return this.authService.updateProfile(req.user.id || req.user.sub, updateProfileData);
    }
    async logout() {
        this.logger.debug('Cerrando sesión');
        return { message: 'Sesión cerrada exitosamente' };
    }
    async refreshToken(req) {
        this.logger.debug(`Refrescando token para usuario: ${req.user.email}`);
        const user = req.user;
        if (!user || !user.sub) {
            throw new common_1.HttpException('Token inválido', common_1.HttpStatus.UNAUTHORIZED);
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
    async recoverPassword(recoverPasswordDto) {
        this.logger.debug(`Solicitud de recuperación para email: ${recoverPasswordDto.email}`);
        try {
            await this.authService.sendPasswordRecoveryEmail(recoverPasswordDto.email);
            return {
                message: 'El enlace para recuperar la contraseña ha sido enviado a tu correo.',
            };
        }
        catch (error) {
            this.logger.error(`Error al enviar enlace de recuperación: ${error.message}`);
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                throw new common_1.HttpException({ error: 'Usuario no encontrado' }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({ error: error.message || 'Error al enviar el enlace de recuperación' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(body) {
        this.logger.debug('Solicitud para restablecer contraseña');
        try {
            await this.authService.resetPassword(body.token, body.newPassword);
            return { message: 'Contraseña restablecida exitosamente' };
        }
        catch (error) {
            this.logger.error(`Error al restablecer contraseña: ${error.message}`);
            throw new common_1.HttpException({ error: error.message || 'Error al restablecer la contraseña' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async testEmail() {
        await this.authService.testEmail();
        return { message: 'Correo de prueba enviado' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, process.env.AVATAR_STORAGE_PATH || './Uploads/avatars');
            },
            filename: (req, file, cb) => {
                const filename = `avatar-${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Solo imágenes JPG/PNG son permitidas'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('recover-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recover_password_dto_1.RecoverPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "recoverPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('test-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testEmail", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map