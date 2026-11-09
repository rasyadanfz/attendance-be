import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from '@app/common';
import { EmployeesService } from './employees.service.js';
import { FindEmployeesDTO } from '../dto/findEmployees.dto.js';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto.js';
import { NonEmptyBodyPipe } from '../validation_pipes/NonEmptyBodyPipe.js';
import { UpdateEmployeeDTO } from '../dto/updateEmployee.dto.js';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Get()
  @Roles('hradmin')
  async getAll(@Query() dto: FindEmployeesDTO) {
    const [result, count] = await this.employeeService.findAll({ ...dto });

    return {
      employees: result.map((e) => ({
        id: e.id,
        full_name: e.fullName,
        email: e.email,
        phone_number: e.phoneNumber,
        position: e.position,
        department: e.department,
        status: e.status,
      })),
      total_count: count,
    };
  }

  @Get(':employeeId')
  @Roles('hradmin')
  async getById(@Param('employeeId', ParseIntPipe) id: number) {
    const data = await this.employeeService.findOne(id);
    return data;
  }

  @Post()
  @Roles('hradmin')
  async create(@Body() dto: CreateEmployeeDTO) {
    const result = await this.employeeService.create({ ...dto });
    return {
      id: result.id,
      full_name: result.fullName,
      email: result.email,
      phone_number: result.phoneNumber,
      position: result.position,
      department: result.department,
      status: result.status,
      created_at: result.createdAt,
    };
  }

  @Patch(':employeeId')
  @Roles('hradmin')
  @HttpCode(200)
  async update(
    @Param('employeeId', ParseIntPipe) id: number,
    @Body(NonEmptyBodyPipe) dto: UpdateEmployeeDTO,
  ) {
    const result = await this.employeeService.update({ id: id, ...dto });
    return {
      id: result.id,
      full_name: result.fullName,
      email: result.email,
      phone_number: result.phoneNumber,
      position: result.position,
      department: result.department,
      status: result.status,
      updated_at: result.updatedAt,
    };
  }
}
