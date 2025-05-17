/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Get } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from 'src/dto/create-contract.dto';
import { Contract } from './contract.entity';

@Controller(process.env.API_CONTRACT_PREFIX || 'contrato')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async createContract(
    @Body() createContractDto: CreateContractDto,
  ): Promise<void> {
    await this.contractService.create(createContractDto);
  }

  @Get()
  async getAllContracts(): Promise<Contract[]> {
    return this.contractService.findAll();
  }
}
