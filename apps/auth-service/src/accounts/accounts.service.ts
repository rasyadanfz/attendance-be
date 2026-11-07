import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, UserRole } from './entities/account.entity.js';
import { Repository } from 'typeorm';
import { CreateAccountDTO } from './dto/createAccount.dto.js';
import * as bcrypt from "bcrypt"
import { UpdateAccountDTO } from './dto/updateAccount.dto.js';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>
    ){}

    async findByEmail(email: string){
        return this.accountRepository.findOne({where: {email}})
    }

    async recordLogin(employeeId: number){
        await this.accountRepository.update({employeeId: employeeId}, {lastLogin: new Date()})
    }

    async create(dto: CreateAccountDTO){
        const existingAccount = await this.accountRepository.findOne({where: {employeeId: dto.employeeId}})
        if (existingAccount) throw new ConflictException("account already exists")

        const passwordHash = await bcrypt.hash(dto.password, 12)
        const newAccount = this.accountRepository.create({
            employeeId: dto.employeeId,
            email: dto.email,
            passwordHash: passwordHash,
            role: dto.role ?? UserRole.EMPLOYEE,
            isActive: dto.isActive
        })

        return this.accountRepository.save(newAccount)
    }

    async update(employeeId: number, email?: string, isActive?: boolean) {
        const account = await this.accountRepository.findOneBy({employeeId: employeeId})
        if (!account) throw new NotFoundException("account not found")
        
        account.email = email ? email : account.email
        account.isActive = isActive ? isActive: account.isActive

        return await this.accountRepository.save(account)
    }
}
