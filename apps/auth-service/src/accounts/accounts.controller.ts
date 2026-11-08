import { Body, Controller, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceKeyGuard } from "@app/common"
import { CreateAccountDTO } from './dto/createAccount.dto.js';
import { AccountsService } from './accounts.service.js';
import { UpdateAccountDTO } from './dto/updateAccount.dto.js';
import { NonEmptyBodyPipe } from '../validation_pipes/NonEmptyBodyPipe.js';

@Controller('internal/accounts')
@UseGuards(ServiceKeyGuard)
export class AccountsController {
    constructor(private accountService: AccountsService){}

    @Post()
    @HttpCode(201)
    async create(@Body() dto: CreateAccountDTO){
        const account = await this.accountService.create(dto)
        return {
            id: account.id,
            employee_id: account.employeeId,
            email: account.email,
            role: account.role
        }
    }

    @Patch(":employeeId")
    @HttpCode(200)
    async update(@Param('employeeId', ParseIntPipe) id: number, @Body(NonEmptyBodyPipe) dto: UpdateAccountDTO) {
        const res = await this.accountService.update(id, dto.email, dto.isActive)
        return {
            id: res.id,
            employee_id: res.employeeId,
            email: res.email,
            is_active: res.isActive
        }
    }
}
