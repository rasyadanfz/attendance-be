import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { Employee, EmployeeStatus } from './entities/employee.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpResponseError, InjectHttpClient, toHttpException } from '@nestjs/http-client';
import { ConfigService } from '@nestjs/config';

interface FindEmployeesData {
    page: number,
    limit: number,
    search: string,
}

interface CreateEmployeeData {
    password: string,
    fullName: string,
    email: string,
    position: string,
    department: string,
    status: EmployeeStatus, 
    phoneNumber?: string,
}

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,

        @InjectHttpClient('auth-service')
        private auth: HttpClient,
    ){}

    async findAll(query: FindEmployeesData) {
        const queryBuilder = this.employeesRepository
        .createQueryBuilder("employees")
        .limit(query.limit)
        .offset(query.limit * (query.page - 1))

        if (query.search) {
            queryBuilder.where("employees.full_name LIKE :search", {search: `%${query.search}%`})
        }

        return await queryBuilder.getManyAndCount()
    }

    async create(data: CreateEmployeeData) {
        const newEmployee = this.employeesRepository.create({
            ...data, status: EmployeeStatus.PENDING
        })

        try {
            await this.employeesRepository.save(newEmployee);
        } catch (e) {
            if (e instanceof QueryFailedError) {
                throw new ConflictException("email already in use")
            }

            throw e
        }

        try {
            await this.auth.post('/internal/accounts',
                {
                    json: {
                        employeeId: newEmployee.id,
                        email: newEmployee.email,
                        password: data.password,
                        role: 'employee'
                    }
                }
            )
        } catch (e) {
            // error 409 means account already exists (idempotent)
            if (!(e instanceof HttpResponseError && e.status === 409)) {
                await this.employeesRepository.delete(newEmployee.id)
                throw toHttpException(e)
            }
        }

        // account creation succeed on auth-service
        newEmployee.status = EmployeeStatus.ACTIVE
        return this.employeesRepository.save(newEmployee)
    }
}
