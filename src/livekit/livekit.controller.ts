import { ApiProperty } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { CreateVoiceRoomDto } from './dto/create-voice-room.dto';
import { LivekitService } from './livekit.service';
import { Response } from 'src/interface/response';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Controller('livekit')
export class LivekitController {
  constructor(
    private readonly livekitService: LivekitService,
    private readonly jwtService: JwtService,
  ) {}

  // @Get(':id/voice-room')
  // @ApiProperty()
  // async getVoiceRoom(@Body() createRoomDto: CreateVoiceRoomDto): Promise<Response> {
  //   const room = await this.livekitService.getVoiceRoom(createRoomDto);
  //   return {
  //     data: room,
  //     status: 'success',
  //   };
  // }
  @UseGuards(JwtAuthGuard)
  @Post(':id/join-voice-room')
  @ApiProperty({ type: [CreateVoiceRoomDto] })
  async joinVoiceRoom(
    @Headers('Authorization') token: string,
    @Param('id') chatId: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token);
    const jwtToken = await this.livekitService.joinVoiceRoom(chatId, userId);
    return {
      data: jwtToken,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/participants')
  @ApiProperty()
  async getVoiceRoom(
    @Headers('Authorization') token: string,
    @Param('id') chatId: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    const participants = await this.livekitService.getParticipants(
      chatId,
      userId,
    );
    return {
      data: participants,
      status: 'success',
    };
  }

  // @Get('/feed')
  // @ApiProperty()
  // async getFeed(): Promise<Response> {
  //   const feed = await this.livekitService.getFeed();
  //   return {
  //     data: feed,
  //     status: 'success',
  //   };
  // }

  // @Post('join')
  // @ApiProperty({ type: [CreateVoiceRoomDto] })
  // async joinRoomAndCreate(
  //   @Body() createRoomDto: CreateVoiceRoomDto,
  // ): Promise<Response> {
  //   const token = await this.livekitService.createAndJoinRoom(createRoomDto);
  //   return {
  //     data: token.toJwt(),
  //     status: 'success',
  //   };
  // }

  // @Get('create-room')
  // @ApiProperty()
  // async createRoom() {
  //   await this.livekitService.createRoom();
  // }

  // @Get('all-rooms')
  // @ApiProperty()
  // async findAllRooms(): Promise<Response> {
  //   const rooms = await this.livekitService.getListRooms();
  //   return {
  //     data: rooms,
  //     status: 'success',
  //   };
  // }

  // @Get('participants')
  // @ApiProperty()
  // async getListParticipants() {
  //   await this.livekitService.listOfParticipants();
  // }
}
