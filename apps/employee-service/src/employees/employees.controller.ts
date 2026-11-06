import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { FindEmployeesDTO } from '../dto/findEmployees.dto.js';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto.js';

@Controller('employees')
export class EmployeesController {
    constructor (private employeeService: EmployeesService) {}

    @Get()
    async getAll(@Query() dto: FindEmployeesDTO){
        const [result, count] = await this.employeeService.findAll({...dto})

        return {
            "employees": result,
            "total_count": count
        }
    }

    @Post()
    async create(@Body() dto: CreateEmployeeDTO) {
        const result = await this.employeeService.create({...dto})
        return {
            ...result, 
        }
    }
}
