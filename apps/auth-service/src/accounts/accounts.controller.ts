import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateAccountDTO } from './dto/createAccount.dto.js';
import { AccountsService } from './accounts.service.js';

@Controller('internal/accounts')
export class AccountsController {
    constructor(private accountService: AccountsService){}

    @Post()
    @HttpCode(201)
    async create(@Body() dto: CreateAccountDTO){
        const account = await this.accountService.create(dto)
        return {
            id: account.id,
            employeeId: account.employeeId,
            email: account.email,
            role: account.role
        }
    }
}
