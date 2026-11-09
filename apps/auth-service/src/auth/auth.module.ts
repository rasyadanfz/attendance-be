import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: config.get('JWT_EXPIRY_TIME', '1h'),
        },
      }),
    }),
    AccountsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
