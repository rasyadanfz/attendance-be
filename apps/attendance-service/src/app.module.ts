import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'
import { PhotoStorageModule } from './photo-storage/photo-storage.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.getOrThrow<string>("ATTENDANCE_DB_URL"),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z'
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.getOrThrow<string>("JWT_SECRET"),
          verifyOptions: { algorithms: ['HS256'] }
      })
    }),
    PhotoStorageModule, 
  ],
})
export class AttendanceServiceModule {}
