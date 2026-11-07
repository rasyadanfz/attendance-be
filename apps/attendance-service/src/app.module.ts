import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
})
export class AttendanceServiceModule {}
