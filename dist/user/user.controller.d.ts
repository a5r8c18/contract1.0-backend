import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
export declare class UserController {
    private readonly userService;
    private readonly configService;
    private readonly logger;
    constructor(userService: UserService, configService: ConfigService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
}
