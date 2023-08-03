import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, TokenModule],
  providers: [ChatGateway],
})
export class ChatModule {}
