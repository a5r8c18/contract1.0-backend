import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
export declare class UserService {
    private userRepository;
    private configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneById(id: number): Promise<User>;
    updatePassword(id: number, newPassword: string): Promise<void>;
    update(id: number, updateData: Partial<User>): Promise<User>;
    findOneByEmail(email: string): Promise<User | undefined>;
}
