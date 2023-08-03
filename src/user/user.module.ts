import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/jwt/jwt.module';
import { EncryptModule } from 'src/encryption/encrypt.module';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [PrismaModule, TokenModule, EncryptModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
})
export class UserModule {}
