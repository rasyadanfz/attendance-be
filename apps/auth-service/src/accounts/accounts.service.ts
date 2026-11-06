import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, UserRole } from './entities/account.entity.js';
import { Repository } from 'typeorm';
import { CreateAccountDTO } from './dto/createAccount.dto.js';
import * as bcrypt from "bcrypt"

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
        if (existingAccount) return existingAccount

        const passwordHash = await bcrypt.hash(dto.password, 12)
        const newAccount = this.accountRepository.create({
            employeeId: dto.employeeId,
            email: dto.email,
            passwordHash: passwordHash,
            role: dto.role ?? UserRole.EMPLOYEE
        })

        return this.accountRepository.save(newAccount)
    }
}
