import { Module } from '@nestjs/common';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesModule } from './schedules/schedules.module'; //定时任务
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'; //邮件ejs解析的库
// 日志系统
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

//全国道路基本信息库实体
import { MonitorSettingModule } from './modules/monitor-setting/monitor-setting.module';
import { RoadinfoModule } from './modules/road-info/road-info.module';
import { EmailModule } from './modules/email/email.module';
import { CityCodeInfoModule } from './modules/city-code-info/city-code-info.module';

@Module({
  imports: [
    //---------------------日志系统------------
    WinstonModule.forRoot({
      exitOnError: false,
      level: 'info',
      format: winston.format.json(),
      // defaultMeta: { service: 'user-service' },
      transports: [
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
          filename: join(__dirname, '/logs/', 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: join(__dirname, '/logs/', 'schedules.log'),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: join(__dirname, '/logs/', 'exception.log'),
        }),
      ],
    }),
    //---------------------定时器------------
    ScheduleModule.forRoot(),
    SchedulesModule,
    //---------------------数据库------------
    TypeOrmModule.forRoot({
      //道路监控数据库
      type: 'mysql',
      host: '192.168.87.250',
      port: 3306,
      username: 'root',
      password: 'careland',
      database: 'Road_monitoring',
      logging: true,
      // synchronize: true,
      autoLoadEntities: true,
      // entities: [CityCodeInfo, CityRoad, MonitorSetting],
    }),
    TypeOrmModule.forRoot({
      // 全国道路长度信息数据库
      name: 'OriginDB',
      type: 'mysql',
      host: '192.168.86.243',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'kz_compare',
      logging: true,
      // synchronize: true,
      // entities: [OriginalRoad],
      autoLoadEntities: true,
    }),
    //----------------------邮件-------------
    MailerModule.forRoot({
      // transport: 'smtps://lingh@kldmap.com:fSgK5)SN5b5g@mail.kldmap.com',
      transport: 'smtps://368332096@qq.com:pfuedffcksvfbjhc@smtp.qq.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: join(__dirname, './templates/email'),
        adapter: new EjsAdapter(),
        options: {
          strict: false, //必须为false  不然ejs完全无法使用
        },
      },
    }),
    CityCodeInfoModule,
    MonitorSettingModule,
    RoadinfoModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
