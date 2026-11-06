import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>
    ){}

    async findAll(page: number, limit: number, search: string) {
        const queryBuilder = this.employeesRepository
        .createQueryBuilder("employees")
        .limit(limit)
        .offset(limit * (page - 1))

        if (search) {
            queryBuilder.where("employees.full_name LIKE :search", {search: `%${search}%`})
        }

        return await queryBuilder.getManyAndCount()
    }
}
