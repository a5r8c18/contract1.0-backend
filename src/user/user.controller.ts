/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Get, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(
      `Datos recibidos para crear usuario: ${JSON.stringify(createUserDto)}`,
    );
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    this.logger.debug('Listando todos los usuarios');
    return this.userService.findAll();
  }
}
