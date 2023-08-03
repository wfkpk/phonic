import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EncryptModule } from 'src/encryption/encrypt.module';
import { TokenModule } from 'src/jwt/jwt.module';
@Module({
  imports: [PrismaModule, EncryptModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
