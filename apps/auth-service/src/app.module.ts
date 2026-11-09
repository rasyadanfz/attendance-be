import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.getOrThrow<string>('AUTH_DB_URL'),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AuthServiceModule {}
