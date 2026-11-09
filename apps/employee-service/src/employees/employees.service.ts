import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Employee, EmployeeStatus } from './entities/employee.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import {
  HttpClient,
  HttpResponseError,
  InjectHttpClient,
  toHttpException,
} from '@nestjs/http-client';
import { ConfigService } from '@nestjs/config';

interface FindEmployeesData {
  page: number;
  limit: number;
  search: string;
  ids?: number[];
}

interface CreateEmployeeData {
  password: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  phoneNumber?: string;
}

interface UpdateEmployeeData extends Partial<
  Omit<CreateEmployeeData, 'password'>
> {
  id: number;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,

    @InjectHttpClient('auth-service')
    private auth: HttpClient,

    private config: ConfigService,
  ) {}

  async findAll(query: FindEmployeesData) {
    if (query.ids?.length) {
      const rows = await this.employeesRepository.findAndCount({
        where: { id: In(query.ids) },
      });
      return rows;
    }

    const queryBuilder = this.employeesRepository
      .createQueryBuilder('employees')
      .limit(query.limit)
      .offset(query.limit * (query.page - 1))
      .orderBy('employees.full_name', 'ASC');

    if (query.search) {
      queryBuilder.where('employees.full_name LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    return await queryBuilder.getManyAndCount();
  }

  async findOne(id: number) {
    const employee = await this.employeesRepository.findOneBy({ id: id });
    if (!employee) throw new NotFoundException('employee not found');

    return employee;
  }

  async create(data: CreateEmployeeData) {
    const newEmployee = this.employeesRepository.create({
      ...data,
      status: EmployeeStatus.PENDING,
    });

    try {
      await this.employeesRepository.save(newEmployee);
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        e.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('email already in use');
      }

      throw e;
    }

    try {
      await this.auth.post('/api/internal/accounts', {
        headers: {
          'X-Service-Key': this.config.getOrThrow<string>('SERVICE_KEY'),
        },
        json: {
          employee_id: newEmployee.id,
          email: newEmployee.email,
          password: data.password,
          role: 'employee',
          is_active: data.status === EmployeeStatus.ACTIVE ? true : false,
        },
      });
    } catch (e) {
      // error 409 means account already exists (idempotent)
      if (!(e instanceof HttpResponseError && e.status === 409)) {
        await this.employeesRepository.delete(newEmployee.id);
        throw toHttpException(e);
      }
    }

    // account creation succeed on auth-service
    newEmployee.status = data.status;
    return this.employeesRepository.save(newEmployee);
  }

  async update(data: UpdateEmployeeData) {
    const { id, ...updateData } = data;

    const oldEmployeeData = await this.employeesRepository.findOneBy({
      id: id,
    });
    if (!oldEmployeeData) throw new NotFoundException('employee not found');

    // Check for auth account changes needed
    const authAccountChanges: { email?: string; is_active?: boolean } = {};
    if (updateData.email && updateData.email !== oldEmployeeData.email) {
      authAccountChanges.email = updateData.email;
    }
    if (updateData.status && updateData.status !== oldEmployeeData.status) {
      authAccountChanges.is_active =
        updateData.status === EmployeeStatus.ACTIVE;
    }

    try {
      await this.employeesRepository.update(id, updateData);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('email already in use');
        }
      }

      throw e;
    }

    // Update auth account if needed
    if (Object.keys(authAccountChanges).length > 0) {
      try {
        await this.auth.patch(`/api/internal/accounts/${id}`, {
          headers: {
            'X-Service-Key': this.config.getOrThrow<string>('SERVICE_KEY'),
          },
          json: authAccountChanges,
        });
      } catch (e) {
        // revert changes in employee database
        await this.employeesRepository.update(id, oldEmployeeData);

        if (e instanceof HttpResponseError && e.status === 409) {
          throw new ConflictException('email already in use');
        }

        throw toHttpException(e);
      }
    }

    return await this.employeesRepository.findOneByOrFail({ id: id });
  }
}
