import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivekitModule } from './livekit/livekit.module';
import { PrismaModule } from './prisma/prisma.module';

import { EncryptModule } from './encryption/encrypt.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    LivekitModule,
    PrismaModule,
    EncryptModule,
    TokenModule,
    UserModule,
    AuthModule,
    RoomModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
