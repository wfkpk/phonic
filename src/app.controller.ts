import { randomBytes } from 'crypto';
import * as crypto from 'crypto';
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
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('encrypt')
  encrypt() {
    // const encryptionKey = randomBytes(32).toString('hex');
    // console.log('Encryption Key:', encryptionKey);
    // const iv = randomBytes(12).toString('hex');
    // console.log('Initialization Vector:', iv);
    // //implement encryption here
    // const keyBuffer = Buffer.from('DoNotUseUTF8Keys', 'utf8');
    // const ivBuffer = Buffer.alloc(0);
    // console.log(keyBuffer, ' ', ivBuffer);
    // const cipher = crypto.createCipheriv('AES-128-ECB', keyBuffer, ivBuffer);
    // let encrypted = cipher.update('Hello World', 'utf8', 'hex');
    // encrypted += cipher.final('hex');
    // console.log('Encrypted:', encrypted);

    //implement decryption here

    this.appService.getDecryptedText();
  }
}
