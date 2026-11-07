import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service.js';
import { LoginDTO } from './dto/login.dto.js';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private accounts: AccountsService,
        private jwtService: JwtService
    ){}

    async login(dto: LoginDTO){
        const account = await this.accounts.findByEmail(dto.email);
        if (!account || !account.isActive) throw new UnauthorizedException("invalid email/password")

        const valid = await bcrypt.compare(dto.password, account.passwordHash)
        if (!valid) throw new UnauthorizedException("invalid email/password")

        const accessToken = await this.jwtService.signAsync({
            sub: account.id,
            role: account.role,
            employee_id: account.employeeId
        })

        await this.accounts.recordLogin(account.id)

        return {accessToken}
    }
}
