import { ApiProperty } from '@nestjs/swagger';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateVoiceRoomDto } from './dto/create-voice-room.dto';
import { LivekitService } from './livekit.service';
import { Response } from 'src/interface/response';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  // @Get('/feed')
  // @ApiProperty()
  // async getFeed(): Promise<Response> {
  //   const feed = await this.livekitService.getFeed();
  //   return {
  //     data: feed,
  //   };
  // }

  @Post('join')
  @ApiProperty({ type: [CreateVoiceRoomDto] })
  async joinRoomAndCreate(
    @Body() createRoomDto: CreateVoiceRoomDto,
  ): Promise<Response> {
    const token = await this.livekitService.createAndJoinRoom(createRoomDto);
    return {
      data: token.toJwt(),
      status: 'success',
    };
  }

  @Get('create-room')
  @ApiProperty()
  async createRoom() {
    await this.livekitService.createRoom();
  }
  @Get('all-rooms')
  @ApiProperty()
  async findAllRooms(): Promise<Response> {
    const rooms = await this.livekitService.getListRooms();
    return {
      data: rooms,
      status: 'success',
    };
  }

  @Get('participants')
  @ApiProperty()
  async getListParticipants() {
    await this.livekitService.listOfParticipants();
  }
}
