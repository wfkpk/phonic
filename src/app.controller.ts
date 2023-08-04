import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptService } from './encryption/encrypt.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly encryptionService: EncryptService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
