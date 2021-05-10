import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
  // private readonly emailFrom = '513279340@qq.com';
  private readonly emailFrom = '368332096@qq.com';
  private readonly emailTo = '842845239@qq.com,513279340@qq.com';
  constructor(private readonly mailerService: MailerService) {}

  // 数据异常警告
  sendWarnningEmail(cityName: string, time: string, message = '') {
    this.mailerService.sendMail({
      to: this.emailTo,
      from: this.emailFrom,
      subject: '道路监控告警-波动异常',
      // html: '<b>来自未来的时空投递站：未来的你身强体壮，美丽依旧，可爱依旧</b>',
      template: './warn',
      context: {
        //传递给模板引擎的数据
        title: '道路监控告警-波动异常',
        cityName,
        time,
        message,
      },
    });
  }

  // 数据中断警告
  sendDataBorkenEmail(cityName: string, time: string, message = '') {
    this.mailerService.sendMail({
      to: this.emailTo,
      from: this.emailFrom,
      subject: '道路监控告警-数据中断',
      // html: '<b>来自未来的时空投递站：未来的你身强体壮，美丽依旧，可爱依旧</b>',
      template: './warn',
      context: {
        //传递给模板引擎的数据
        title: '道路监控告警-数据中断',
        cityName,
        time,
        message,
      },
    });
  }
  // 数据中断恢复通知
  sendDataBorkenRestoreEmail(cityName: string, time: string, message = '') {
    this.mailerService.sendMail({
      to: this.emailTo,
      from: this.emailFrom,
      subject: '道路监控告警-数据中断恢复',
      // html: '<b>来自未来的时空投递站：未来的你身强体壮，美丽依旧，可爱依旧</b>',
      template: './warn',
      context: {
        //传递给模板引擎的数据
        title: '道路监控告警-数据中断恢复',
        cityName,
        time,
        message,
      },
    });
  }
}
