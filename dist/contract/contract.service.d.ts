import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { CreateContractDto } from 'src/dto/create-contract.dto';
export declare class ContractService {
    private contractRepository;
    constructor(contractRepository: Repository<Contract>);
    create(createContractDto: CreateContractDto): Promise<Contract>;
    findAll(): Promise<Contract[]>;
}
