import { Controller, Get } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service.js';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get("/auth")
  getHello(): string {
    return this.authServiceService.getHello();
  }
}
