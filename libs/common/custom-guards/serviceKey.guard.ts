import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ServiceKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const serviceKey = this.configService.getOrThrow<string>('SERVICE_KEY');

    const req = context.switchToHttp().getRequest<Request>();
    const serviceKeyHeader = req.headers['x-service-key'];

    if (!serviceKeyHeader || typeof serviceKeyHeader !== 'string')
      throw new UnauthorizedException();

    return serviceKey === serviceKeyHeader;
  }
}
