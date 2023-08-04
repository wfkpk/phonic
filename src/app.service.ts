import { EncryptService } from 'src/encryption/encrypt.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly encryptService: EncryptService) {}
  async getHello(): Promise<any> {
    return {
      data: 'Hello World!',
    };
  }
}
