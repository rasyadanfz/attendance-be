import { Controller, Get, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { FindEmployeesDTO } from '../dto/find-employees.dto.js';

@Controller('employees')
export class EmployeesController {
    constructor (private employeeService: EmployeesService) {}

    @Get()
    async getAll(@Query() dto: FindEmployeesDTO){
        const [result, count] = await this.employeeService.findAll(dto.page, dto.limit, dto.search)

        return {
            "employees": result,
            "total_count": count
        }
    }
}
