import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';

@Module({
  imports: [],
  controllers: [LivekitController],
  providers: [LivekitService],
})
export class LivekitModule {}
