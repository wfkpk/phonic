import { ApiProperty } from '@nestjs/swagger';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { LivekitService } from './livekit.service';
import { Response } from 'src/interface/response';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}
  @Post('join')
  @ApiProperty({ type: [CreateRoomDto] })
  async joinRoomAndCreate(
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Response> {
    const token = await this.livekitService.createAndJoinRoom(createRoomDto);
    return {
      data: token.toJwt(),
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
    };
  }

  @Get('participants')
  @ApiProperty()
  async getListParticipants() {
    await this.livekitService.listOfParticipants();
  }
}
