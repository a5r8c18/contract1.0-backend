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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
let UserService = class UserService {
    userRepository;
    configService;
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async create(createUserDto) {
        let password = createUserDto.password;
        if (!password.startsWith('$2b$')) {
            const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
            password = await bcrypt.hash(password, saltRounds);
        }
        const user = this.userRepository.create({
            ...createUserDto,
            password,
            rol: createUserDto.rol ||
                this.configService.get('DEFAULT_USER_ROLE', 'user'),
        });
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOneById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async updatePassword(id, newPassword) {
        const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await this.userRepository.update(id, {
            password: hashedPassword,
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('No se pudo actualizar la contraseña, usuario no encontrado');
        }
    }
    async update(id, updateData) {
        await this.userRepository.update(id, updateData);
        const user = await this.findOneById(id);
        return user;
    }
    async findOneByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user ?? undefined;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map