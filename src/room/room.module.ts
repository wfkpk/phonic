import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TokenModule } from 'src/jwt/jwt.module';
import { EncryptModule } from 'src/encryption/encrypt.module';

@Module({
  imports: [PrismaModule, TokenModule, EncryptModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
