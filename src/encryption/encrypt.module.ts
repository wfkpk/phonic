import { Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EncryptService],
  exports: [EncryptService],
})
export class EncryptModule {}
