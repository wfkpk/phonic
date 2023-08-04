import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateKeyPairSync, privateDecrypt, publicEncrypt } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class EncryptService {
  private readonly saltRounds = 10;
  // private readonly algorithm = 'aes-256-cbc';
  // private readonly encryptionKey = 'fffffffffff'; // Replace with your encryption key environment variable
  // private readonly iv = Buffer.from(randomBytes(16)); // Generate a random IV
  constructor(private prisma: PrismaService) {}

  // Generates a new key pair for a chat ID
  async generateKeyPair(chatId: string): Promise<void> {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keyPair = await this.prisma.keyPair.create({
      data: {
        publicKey,
        privateKey,
        chat: {
          connect: { id: chatId },
        },
      },
    });

    console.log(`Generated key pair for chat ID: ${chatId}`);
    console.log(keyPair);
  }

  // Retrieves the key pair for a chat ID
  async getKeyPair(
    chatId: string,
  ): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await this.prisma.keyPair.findUnique({
      where: { chatId },
      include: { chat: true },
    });
    if (!keyPair) {
      throw new Error(`No key pair found for chat ID: ${chatId}`);
    }

    return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
  }

  // Encrypts a message using the public key associated with a chat ID
  async encryptMessage(chatId: string, message: string): Promise<string> {
    const { publicKey } = await this.getKeyPair(chatId);
    const encryptedBuffer = publicEncrypt(
      publicKey,
      Buffer.from(message, 'utf8'),
    );
    console.log(encryptedBuffer.toString('base64'));
    return encryptedBuffer.toString('base64');
  }

  // Decrypts an encrypted message using the private key associated with a chat ID
  async decryptMessage(
    chatId: string,
    encryptedMessage: string,
  ): Promise<string> {
    const { privateKey } = await this.getKeyPair(chatId);
    const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');
    const decryptedBuffer = privateDecrypt(
      { key: privateKey, passphrase: '' },
      encryptedBuffer,
    );
    // console.log(decryptedBuffer.toString('utf-8'));
    return decryptedBuffer.toString('utf8');
  }

  async decryptListOfMessages(
    chatId: string,
    encryptedMessages: string[],
  ): Promise<string[]> {
    const { privateKey } = await this.getKeyPair(chatId);

    const decryptedMessages: string[] = [];

    for (const encryptedMessage of encryptedMessages) {
      const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');
      const decryptedBuffer = privateDecrypt(
        { key: privateKey, passphrase: '' },
        encryptedBuffer,
      );
      const decryptedMessage = decryptedBuffer.toString('utf8');
      decryptedMessages.push(decryptedMessage);
    }

    return decryptedMessages;
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  // encrypt(text: string): string {
  //   const keyBuffer = Buffer.from('DoNotUseUTF8Keys', 'utf8');
  //   const ivBuffer = Buffer.alloc(0);
  //   const cipher = crypto.createCipheriv('AES-128-ECB', keyBuffer, ivBuffer);
  //   let encrypted = cipher.update(text, 'utf8', 'hex');
  //   encrypted += cipher.final('hex');
  //   console.log('Encrypted:', encrypted);
  //   return encrypted;
  // }

  // decrypt(text: string): string {
  //   const keyBuffer = Buffer.from('DoNotUseUTF8Keys', 'utf8');
  //   const ivBuffer = Buffer.alloc(0);
  //   const decipher = crypto.createDecipheriv(
  //     'AES-128-ECB',
  //     keyBuffer,
  //     ivBuffer,
  //   );
  //   let decrypted = decipher.update(text, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8');
  //   console.log('Decrypted:', decrypted);
  //   return decrypted;
  // }
  // encrypt(text: string): string {
  //   console.log('Encryption Key:', this.encryptionKey);
  //   console.log('Initialization Vector:', this.iv);
  //   console.log('Text to encrypt:', text);

  //   const cipher = crypto.createCipheriv(
  //     this.algorithm,
  //     this.encryptionKey,
  //     this.iv,
  //   );
  //   let encrypted = cipher.update(text, 'utf8', 'hex');
  //   encrypted += cipher.final('hex');

  //   console.log('Encrypted:', encrypted);
  //   return encrypted;
  // }

  // decrypt(text: string): string {
  //   const decipher = crypto.createDecipheriv(
  //     this.algorithm,
  //     this.encryptionKey,
  //     this.iv,
  //   );
  //   let decrypted = decipher.update(text, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8');

  //   console.log('Decrypted:', decrypted);
  //   return decrypted;
  // }

  // generateRandomKeys() {
  //   const encryptionKey = randomBytes(32).toString('hex');
  //   console.log('Encryption Key:', encryptionKey);
  //   const iv = randomBytes(12).toString('hex');
  //   console.log('Initialization Vector:', iv);
  // }
}
