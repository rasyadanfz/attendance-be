import {
  IsOptional,
  IsInt,
  Min,
  Matches,
  IsISO8601,
  IsEnum,
  Max,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AttendanceAction } from '../entities/attendance.entity.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class GetAllAttendancesDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsOptional()
  @Matches(DATE_REGEX, { message: 'from must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true }, { message: 'from must be a valid date' })
  from?: string;

  @IsOptional()
  @Matches(DATE_REGEX, { message: 'to must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true }, { message: 'to must be a valid date' })
  to?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  @Min(1, { each: true })
  employeeIds?: number[]; // ?ids=1,2,3,...

  @IsOptional()
  @IsEnum(AttendanceAction)
  action?: AttendanceAction;
}
