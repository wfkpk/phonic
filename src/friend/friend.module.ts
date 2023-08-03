import { Module } from '@nestjs/common';
import { TokenModule } from 'src/jwt/jwt.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
