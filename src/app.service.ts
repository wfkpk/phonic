import { EncryptService } from 'src/encryption/encrypt.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly encryptService: EncryptService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getEncryptedText(): Promise<string> {
    const text = 'Hello World!';
    const chatId = '2be23ef3-f7e4-4246-a40d-31377a2982ed';
    return await this.encryptService.encryptMessage(chatId, text);
  }

  async getDecryptedText(): Promise<string> {
    const text =
      'Axx9xtmzvvHAVv3rMaEa5o7xRRI/lCfyvUA4qDS6+OOlNUaosx8qw15bLd/6e7Xnb8iFzBz7o2IgwgsBBpe0XolFp4KbtL4vDqG62IUszU0gMO7ilu41jay1Ef6pnAPASk3dCYki6Ge2U4wCXRB8GceuzBnnPt2bYZ+w3fMPuF3zDwPbfTnJHN7u/F4SnX8sG92C3QPhOjr7MPq/gTac9Y2OLCH1fRmnVNRYBjCmAqcxLowI8U6C7N+c1Z5CXgqFd7K6O6IJbawC6mN3SOYuJ875z0UaXMJ3jZoi+tMmfRzQ76AWnwPbCVxuExC5cs4qCtIEmUmLtX0q43MzBjwpGw==';
    const chatId = '2be23ef3-f7e4-4246-a40d-31377a2982ed';
    return await this.encryptService.decryptMessage(chatId, text);
  }
}
