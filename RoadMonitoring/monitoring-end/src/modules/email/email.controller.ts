import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  sendEmail(): string {
    this.emailService.sendWarnningEmail('北京市', '12:23');
    return 'ok';
  }
}
