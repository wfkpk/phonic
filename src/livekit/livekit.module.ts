import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [LivekitController],
  providers: [LivekitService],
})
export class LivekitModule {}
