import { ContractService } from './contract.service';
import { CreateContractDto } from 'src/dto/create-contract.dto';
import { Contract } from './contract.entity';
export declare class ContractController {
    private readonly contractService;
    constructor(contractService: ContractService);
    createContract(createContractDto: CreateContractDto): Promise<void>;
    getAllContracts(): Promise<Contract[]>;
}
