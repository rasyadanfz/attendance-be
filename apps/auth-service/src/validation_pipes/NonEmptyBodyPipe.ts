import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";

@Injectable()
export class NonEmptyBodyPipe implements PipeTransform {
  transform(value: unknown) {
    const hasValue = value && Object.values(value as object).some((v) => v !== undefined);
    if (!hasValue) {
      throw new BadRequestException('provide at least one field to update');
    }
    return value;
  }
}