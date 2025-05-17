/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password = createUserDto.password;
    // Verificar si la contraseña ya está hasheada
    if (!password.startsWith('$2b$')) {
      const saltRounds = this.configService.get<number>(
        'BCRYPT_SALT_ROUNDS',
        10,
      );
      password = await bcrypt.hash(password, saltRounds);
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password,
      rol:
        createUserDto.rol ||
        this.configService.get<string>('DEFAULT_USER_ROLE', 'user'),
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const result = await this.userRepository.update(id, {
      password: hashedPassword,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'No se pudo actualizar la contraseña, usuario no encontrado',
      );
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const user = await this.findOneById(id);
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }
}
